'use client';

import { motion } from 'framer-motion';
import { Globe, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  metaTitle: Yup.string().required('এসইও মেটা টাইটেল আবশ্যক').max(60, 'সর্বোচ্চ ৬০ অক্ষরের মধ্যে হতে হবে'),
  metaDescription: Yup.string().required('এসইও মেটা ডেসক্রিপশন আবশ্যক').max(160, 'সর্বোচ্চ ১৬০ অক্ষরের মধ্যে হতে হবে'),
  keywords: Yup.string().nullable(),
});

export default function SEOPage() {
  const formik = useFormik({
    initialValues: {
      metaTitle: 'পাঞ্জাবি ঘর - প্রিমিয়াম পাঞ্জাবি কালেকশন',
      metaDescription: 'সেরা মানের সুতি কাপড়ের আকর্ষণীয় পাঞ্জাবি কিনুন সাশ্রয়ী মূল্যে। কালার গ্যারান্টি ও দেশব্যাপী ক্যাশ অন ডেলিভারি!',
      keywords: 'পাঞ্জাবি, পাঞ্জাবি ঘর, পাঞ্জাবি ডিজাইন, পাঞ্জাবি কালেকশন',
    },
    validationSchema,
    onSubmit: (values) => {
      alert(`SEO Settings Saved: ${JSON.stringify(values, null, 2)}`);
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
          <Globe size={26} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">এসইও সেটিংস (SEO Settings)</h1>
          <p className="text-muted-foreground mt-1.5 text-xs font-semibold">সার্চ ইঞ্জিনে আপনার স্টোরটির ভিজিবিলিটি ও র‍্যাঙ্কিং উন্নত করুন।</p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="bg-card rounded-2xl border border-border/60 p-6 space-y-6 shadow-xs">
          
          <div>
            <label className="block text-xs font-semibold mb-2">সার্চ ইঞ্জিন মেটা টাইটেল (Meta Title)</label>
            <input
              type="text"
              {...formik.getFieldProps('metaTitle')}
              className="w-full px-3.5 py-2 bg-muted rounded-xl border border-border outline-none text-xs font-semibold text-foreground focus:border-primary"
              placeholder="Enter SEO Meta Title (Max 60 chars)"
            />
            {formik.touched.metaTitle && formik.errors.metaTitle && (
              <p className="text-[10px] text-destructive mt-1 font-bold">{formik.errors.metaTitle}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2">সার্চ ইঞ্জিন মেটা ডেসক্রিপশন (Meta Description)</label>
            <textarea
              {...formik.getFieldProps('metaDescription')}
              className="w-full px-3.5 py-2 bg-muted rounded-xl border border-border outline-none text-xs text-foreground focus:border-primary min-h-[80px]"
              placeholder="Enter SEO Meta Description (Max 160 chars)"
            />
            {formik.touched.metaDescription && formik.errors.metaDescription && (
              <p className="text-[10px] text-destructive mt-1 font-bold">{formik.errors.metaDescription}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2">মেটা কিওয়ার্ডস (Keywords - কমা দিয়ে আলাদা করুন)</label>
            <input
              type="text"
              {...formik.getFieldProps('keywords')}
              className="w-full px-3.5 py-2 bg-muted rounded-xl border border-border outline-none text-xs font-semibold text-foreground focus:border-primary"
              placeholder="e.g. panjabi, ecommerce, panjabi ghor"
            />
            {formik.touched.keywords && formik.errors.keywords && (
              <p className="text-[10px] text-destructive mt-1 font-bold">{formik.errors.keywords}</p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-border flex justify-end gap-3.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => formik.resetForm()}
              className="rounded-xl cursor-pointer"
            >
              রিসেট করুন
            </Button>
            <Button type="submit" className="rounded-xl cursor-pointer text-white">
              <Save size={16} className="mr-1.5" /> সেটিংস সংরক্ষণ করুন
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
