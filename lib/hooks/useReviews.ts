'use client';

import { useState, useEffect, useCallback } from 'react';
import { Review } from '../types';

const defaultReviews: Review[] = [
  {
    id: '1',
    name: 'রাকিবুল ইসলাম',
    city: 'ঢাকা',
    comment: 'কাপড়ের মান অনেক ভালো। ফিটিং পারফেক্ট এবং ডিজাইন অনেক সুন্দর। সময়মত পেয়েছি, ধন্যবাদ!',
    date: '২ দিন আগে',
    rating: 5,
    approved: true
  },
  {
    id: '2',
    name: 'সাজাদ হোসেন',
    city: 'চট্টগ্রাম',
    comment: 'প্রিমিয়াম কোয়ালিটি একদম যেমনটা দেখেছি ওরকম সেলাই পেয়েছি। সবাই অসম্ভব প্রশংসা করেছে।',
    date: '৩ দিন আগে',
    rating: 5,
    approved: true
  },
  {
    id: '3',
    name: 'আরিফ আহমেদ',
    city: 'সিলেট',
    comment: 'খুবই আরামদায়ক কাপড়, গরমে পরার জন্য পারফেক্ট পাঞ্জাবি। ডেলিভারি সার্ভিসও অনেক ফাস্ট ছিল।',
    date: '১ সপ্তাহ আগে',
    rating: 5,
    approved: true
  },
  {
    id: '4',
    name: 'মাহমুদ হাসান',
    city: 'রাজশাহী',
    comment: 'ফ্যাব্রিক কোয়ালিটি অসাধারণ এবং স্টিচিং ফিনিশিং খুবই চমৎকার। দাম অনুযায়ী প্রোডাক্টটি বেস্ট!',
    date: '২ সপ্তাহ আগে',
    rating: 5,
    approved: true
  }
];

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('reviews');
      if (stored) {
        try {
          // Parse reviews and convert date strings back if necessary
          setReviews(JSON.parse(stored));
        } catch (e) {
          setReviews(defaultReviews);
          localStorage.setItem('reviews', JSON.stringify(defaultReviews));
        }
      } else {
        setReviews(defaultReviews);
        localStorage.setItem('reviews', JSON.stringify(defaultReviews));
      }
    }
  }, []);

  const addReview = useCallback((review: Omit<Review, 'id' | 'date' | 'approved'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      date: 'আজই',
      approved: false, // Default to pending approval
    };
    setReviews((prev) => {
      const next = [newReview, ...prev];
      localStorage.setItem('reviews', JSON.stringify(next));
      return next;
    });
    return newReview;
  }, []);

  const deleteReview = useCallback((id: string) => {
    setReviews((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem('reviews', JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleApproveReview = useCallback((id: string) => {
    setReviews((prev) => {
      const next = prev.map((r) => 
        r.id === id ? { ...r, approved: !r.approved } : r
      );
      localStorage.setItem('reviews', JSON.stringify(next));
      return next;
    });
  }, []);

  return {
    reviews,
    addReview,
    deleteReview,
    toggleApproveReview,
  };
}
