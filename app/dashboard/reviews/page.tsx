'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useReviews } from '@/lib/hooks/useReviews';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Trash2, 
  Check, 
  Star, 
  Search, 
  Filter,
  CheckCircle2,
  XCircle,
  ThumbsUp,
  MessageCircle,
  StarHalf
} from 'lucide-react';
import { cn } from '@/lib/utils';

function toBanglaNum(num: number | string): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit)]);
}

export default function CustomerReviewsPage() {
  const { reviews, deleteReview, toggleApproveReview } = useReviews();
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');

  // Stats calculations
  const stats = useMemo(() => {
    const total = reviews.length;
    const approved = reviews.filter(r => r.approved).length;
    const pending = total - approved;
    const sumRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = total > 0 ? (sumRatings / total).toFixed(1) : '0.0';

    return { total, approved, pending, avg };
  }, [reviews]);

  // Filter logic
  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchesSearch = 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.city && r.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        r.comment.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRating = 
        ratingFilter === 'all' || 
        r.rating === parseInt(ratingFilter);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'approved' && r.approved) ||
        (statusFilter === 'pending' && !r.approved);

      return matchesSearch && matchesRating && matchesStatus;
    });
  }, [reviews, searchQuery, ratingFilter, statusFilter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 w-full pb-16"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <MessageSquare className="text-primary" size={30} />
            কাস্টমার রিভিউসমূহ
          </h1>
          <p className="text-muted-foreground mt-2">আপনার ল্যান্ডিং পেজে কাস্টমার রিভিউ অনুমোদন, বাতিল বা ডিলিট করুন।</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="premium-card bg-card p-6 rounded-2xl border border-border/60 relative overflow-hidden flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">মোট রিভিউ</span>
            <h3 className="text-3xl font-extrabold text-foreground mt-2">{toBanglaNum(stats.total)}</h3>
          </div>
          <div className="absolute right-4 bottom-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MessageCircle size={16} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="premium-card bg-card p-6 rounded-2xl border border-border/60 relative overflow-hidden flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">গড় রেটিং</span>
            <div className="flex items-center gap-2 mt-2">
              <h3 className="text-3xl font-extrabold text-foreground">{toBanglaNum(stats.avg)}</h3>
              <div className="flex items-center text-amber-500">
                <Star size={18} className="fill-current" />
              </div>
            </div>
          </div>
          <div className="absolute right-4 bottom-4 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Star size={16} className="fill-current" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="premium-card bg-card p-6 rounded-2xl border border-border/60 relative overflow-hidden flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">অনুমোদিত ও লাইভ</span>
            <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{toBanglaNum(stats.approved)}</h3>
          </div>
          <div className="absolute right-4 bottom-4 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={16} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="premium-card bg-card p-6 rounded-2xl border border-border/60 relative overflow-hidden flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">পেন্ডিং রিভিউ</span>
            <h3 className="text-3xl font-extrabold text-rose-500 mt-2">{toBanglaNum(stats.pending)}</h3>
          </div>
          <div className="absolute right-4 bottom-4 w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <ThumbsUp size={16} />
          </div>
        </div>
      </div>

      <div className="premium-card p-4 bg-card">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search query */}
            <div className="sm:col-span-2 lg:col-span-2 flex items-center gap-2.5 bg-muted/65 border border-border/50 rounded-xl px-4 py-2 hover:border-border transition-all duration-200">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="রিভিউ, নাম অথবা শহর সার্চ করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Rating filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3.5 py-2 bg-muted/65 border border-border/80 outline-none text-sm rounded-xl transition-all font-semibold text-foreground cursor-pointer"
            >
              <option value="all">সব রেটিং</option>
              <option value="5">৫ স্টার</option>
              <option value="4">৪ স্টার</option>
              <option value="3">৩ স্টার</option>
              <option value="2">২ স্টার</option>
              <option value="1">১ স্টার</option>
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3.5 py-2 bg-muted/65 border border-border/80 outline-none text-sm rounded-xl transition-all font-semibold text-foreground cursor-pointer"
            >
              <option value="all">সব স্ট্যাটাস</option>
              <option value="approved">অনুমোদিত ও লাইভ</option>
              <option value="pending">পেন্ডিং রিভিউ</option>
            </select>
          </div>
          <div className="text-xs text-muted-foreground font-semibold flex items-center gap-2 px-1">
            <Filter size={13} />
            {toBanglaNum(filteredReviews.length)}টি রিভিউ পাওয়া গেছে
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/60 p-12 text-center">
            <p className="text-muted-foreground">আপনার ফিল্টারের সাথে মিলে এমন কোনো কাস্টমার রিভিউ পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "premium-card bg-card p-6 rounded-2xl border border-border/60 flex flex-col md:flex-row justify-between md:items-center gap-6 transition-all hover:border-border",
                  !review.approved && "bg-[#fffbeb]/20 border-amber-500/20"
                )}
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm select-none">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                        {review.name}
                        {review.city && (
                          <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-semibold">
                            {review.city}
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{review.date}</p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={14}
                        className={cn(
                          idx < review.rating ? "fill-current" : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                    "{review.comment}"
                  </p>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center gap-3 border-t md:border-t-0 border-border/40 pt-4 md:pt-0">
                  <div className="flex items-center gap-1.5">
                    {review.approved ? (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12} /> লাইভ ও অনূমোদিত
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <ThumbsUp size={12} /> পেন্ডিং রিভিউ
                      </span>
                    )}
                  </div>

                  <div className="h-6 w-[1px] bg-border/60 mx-1 hidden sm:block" />

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleApproveReview(review.id)}
                      className={cn(
                        "h-8 px-3 rounded-lg text-xs font-bold select-none cursor-pointer",
                        review.approved
                          ? "hover:bg-rose-500/10 hover:text-rose-500"
                          : "hover:bg-emerald-500/10 hover:text-emerald-500"
                      )}
                    >
                      {review.approved ? 'বাতিল / হাইড করুন' : 'অনুমোদন ও পাবলিশ'}
                    </Button>

                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm('রিভিউটি স্থায়ীভাবে ডিলিট করতে চান?')) {
                          deleteReview(review.id);
                        }
                      }}
                      className="text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-lg h-8 w-8 cursor-pointer select-none"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
