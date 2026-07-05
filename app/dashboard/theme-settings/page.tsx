'use client';

import { motion } from 'framer-motion';
import { Palette, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  primary: Yup.string()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'সঠিক হেক্স কালার কোড দিন (যেমন #3b82f6)')
    .required('কালার কোড আবশ্যক'),
  secondary: Yup.string()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'সঠিক হেক্স কালার কোড দিন (যেমন #10b981)')
    .required('কালার কোড আবশ্যক'),
  accent: Yup.string()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'সঠিক হেক্স কালার কোড দিন (যেমন #f59e0b)')
    .required('কালার কোড আবশ্যক'),
  heading: Yup.string().required('হেডিং ফন্ট আবশ্যক'),
  body: Yup.string().required('বডি ফন্ট আবশ্যক'),
});

export default function ThemeSettingsPage() {
  const formik = useFormik({
    initialValues: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      heading: 'Inter',
      body: 'Inter',
    },
    validationSchema,
    onSubmit: (values) => {
      alert(`API Submit: ${JSON.stringify(values, null, 2)}`);
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
          <Palette size={26} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">থিম সেটিংস (Theme Settings)</h1>
          <p className="text-muted-foreground mt-1.5 text-xs font-semibold">আপনার অনলাইন স্টোরের ভিজ্যুয়াল রূপরেখা কাস্টমাইজ করুন।</p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="bg-card rounded-2xl border border-border/60 p-6 space-y-6 shadow-xs">
          
          {/* Color Settings */}
          <div>
            <h2 className="text-base font-bold text-[#1a365d] mb-4">কালার প্যালেট (Colors)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Primary */}
              <div>
                <label className="block text-xs font-semibold mb-2">প্রাইমারি কালার (Primary Color)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="primary"
                    value={formik.values.primary}
                    onChange={formik.handleChange}
                    className="w-12 h-12 rounded-xl border border-border cursor-pointer flex-shrink-0"
                  />
                  <input
                    type="text"
                    {...formik.getFieldProps('primary')}
                    className="flex-1 px-3 py-2 bg-muted rounded-xl border border-border outline-none text-xs font-mono"
                  />
                </div>
                {formik.touched.primary && formik.errors.primary && (
                  <p className="text-[10px] text-destructive mt-1 font-bold">{formik.errors.primary}</p>
                )}
              </div>

              {/* Secondary */}
              <div>
                <label className="block text-xs font-semibold mb-2">সেকেন্ডারি কালার (Secondary Color)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="secondary"
                    value={formik.values.secondary}
                    onChange={formik.handleChange}
                    className="w-12 h-12 rounded-xl border border-border cursor-pointer flex-shrink-0"
                  />
                  <input
                    type="text"
                    {...formik.getFieldProps('secondary')}
                    className="flex-1 px-3 py-2 bg-muted rounded-xl border border-border outline-none text-xs font-mono"
                  />
                </div>
                {formik.touched.secondary && formik.errors.secondary && (
                  <p className="text-[10px] text-destructive mt-1 font-bold">{formik.errors.secondary}</p>
                )}
              </div>

              {/* Accent */}
              <div>
                <label className="block text-xs font-semibold mb-2">অ্যাকসেন্ট কালার (Accent Color)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="accent"
                    value={formik.values.accent}
                    onChange={formik.handleChange}
                    className="w-12 h-12 rounded-xl border border-border cursor-pointer flex-shrink-0"
                  />
                  <input
                    type="text"
                    {...formik.getFieldProps('accent')}
                    className="flex-1 px-3 py-2 bg-muted rounded-xl border border-border outline-none text-xs font-mono"
                  />
                </div>
                {formik.touched.accent && formik.errors.accent && (
                  <p className="text-[10px] text-destructive mt-1 font-bold">{formik.errors.accent}</p>
                )}
              </div>

            </div>
          </div>

          {/* Typography Settings */}
          <div className="pt-6 border-t border-border/80">
            <h2 className="text-base font-bold text-[#1a365d] mb-4">টাইপোগ্রাফি ও ফন্ট (Typography)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-semibold mb-2">হেডিং ফন্ট (Heading Font)</label>
                <select
                  {...formik.getFieldProps('heading')}
                  className="w-full px-3.5 py-2 bg-muted rounded-xl border border-border outline-none text-xs font-bold text-foreground cursor-pointer"
                >
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Poppins</option>
                  <option>Montserrat</option>
                </select>
                {formik.touched.heading && formik.errors.heading && (
                  <p className="text-[10px] text-destructive mt-1 font-bold">{formik.errors.heading}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2">বডি ফন্ট (Body Font)</label>
                <select
                  {...formik.getFieldProps('body')}
                  className="w-full px-3.5 py-2 bg-muted rounded-xl border border-border outline-none text-xs font-bold text-foreground cursor-pointer"
                >
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Poppins</option>
                  <option>Montserrat</option>
                </select>
                {formik.touched.body && formik.errors.body && (
                  <p className="text-[10px] text-destructive mt-1 font-bold">{formik.errors.body}</p>
                )}
              </div>

            </div>
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
              <Save size={16} className="mr-1.5" /> সংরক্ষণ করুন
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
