"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";
import { PageTitle } from "@/components/shared/page-title";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { SEOHead } from "@/components/shared/seo-head";

const contactSchema = z.object({
  firstName: z.string().min(2, "Nama depan wajib diisi"),
  lastName: z.string().min(2, "Nama belakang wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  company: z.string().optional(),
  message: z.string().min(10, "Pesan terlalu singkat (minimal 10 karakter)")
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function KontakPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });
  const { data: settings } = usePlatformSettings();

  const siteName = settings?.general?.site_name || "TeamVora";
  const contactEmail = settings?.contact?.contact_email || "info@teamvora.coded.my.id";
  const contactSupportEmail = settings?.contact?.support_email || "support@teamvora.coded.my.id";
  const contactPhone = settings?.contact?.phone || "+62 811 1234 5678";
  const contactHours = settings?.contact?.office_hours || "Senin - Jumat, 09:00 - 17:00 WIB";
  const contactAddress = settings?.contact?.address || "Gedung Tech Center Lt. 12, Jl. Sudirman No. 45, Jakarta Selatan 12190";

  const contactMethods = [
    {
      title: "Email",
      desc1: contactEmail,
      desc2: contactSupportEmail,
      icon: Mail,
      delay: 0.1
    },
    {
      title: "Telepon",
      desc1: contactPhone,
      desc2: contactHours,
      icon: Phone,
      delay: 0.2
    },
    {
      title: "Kantor Pusat",
      desc1: contactAddress.split(",")[0] || contactAddress,
      desc2: contactAddress.split(",").slice(1).join(",").trim() || "",
      icon: MapPin,
      delay: 0.3
    }
  ];

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await api.post("/contact", {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        company: data.company || null,
        message: data.message,
      });
      toast.success("Pesan Berhasil Terkirim", {
        description: "Tim kami akan menghubungi Anda dalam 1x24 jam.",
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
      });
      reset();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Gagal mengirim pesan. Silakan coba lagi.";
      toast.error("Gagal Mengirim", { description: msg });
    }
  };

  return (
    <div className="pt-32 pb-32 relative overflow-hidden bg-background">
      <SEOHead
        title={`Hubungi Kami | ${siteName}`}
        description="Hubungi tim TeamVora untuk demo, kustomisasi enterprise, atau pertanyaan seputar fitur platform manajemen tim."
        keywords="kontak TeamVora, hubungi kami, demo, sales, support"
        ogUrl="https://teamvora.coded.my.id/kontak"
      />
      <PageTitle title={`Kontak | ${siteName}`} />
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6 inline-block">
            Tim Dukungan 24/7
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Mari Berdiskusi</h1>
          <p className="text-xl text-muted-foreground text-balance">
            Tingkatkan efisiensi tim Anda hari ini. Hubungi tim sales kami untuk demo eksklusif, kustomisasi enterprise, atau pertanyaan terkait fitur.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="lg:col-span-2 space-y-6">
            {contactMethods.map((method, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: method.delay, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="p-8 rounded-3xl border border-border/50 bg-card hover:bg-muted/30 transition-colors group flex gap-6 items-start shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <method.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2">{method.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{method.desc1}</p>
                  <p className="text-muted-foreground leading-relaxed">{method.desc2}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 rounded-3xl border border-border/50 bg-card shadow-xl space-y-8">
              <div className="space-y-2 mb-8">
                <h3 className="text-2xl font-bold">Kirim Pesan Langsung</h3>
                <p className="text-muted-foreground">Isi formulir di bawah ini dan kami akan membalas secepatnya.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="firstName" className="text-sm font-semibold">Nama Depan <span className="text-destructive">*</span></label>
                  <input 
                    type="text" 
                    id="firstName"
                    {...register("firstName")}
                    className={`w-full h-12 px-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.firstName ? 'border-destructive' : 'border-border'}`}
                    placeholder="Budi"
                  />
                  {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-3">
                  <label htmlFor="lastName" className="text-sm font-semibold">Nama Belakang <span className="text-destructive">*</span></label>
                  <input 
                    type="text" 
                    id="lastName"
                    {...register("lastName")}
                    className={`w-full h-12 px-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.lastName ? 'border-destructive' : 'border-border'}`}
                    placeholder="Santoso"
                  />
                  {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                </div>
              </div>
              
              <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-semibold">Email Kerja <span className="text-destructive">*</span></label>
                <input 
                  type="email" 
                  id="email"
                  {...register("email")}
                  className={`w-full h-12 px-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.email ? 'border-destructive' : 'border-border'}`}
                  placeholder="budi@perusahaan.com"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-3">
                <label htmlFor="company" className="text-sm font-semibold">Nama Perusahaan</label>
                <input 
                  type="text" 
                  id="company"
                  {...register("company")}
                  className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="PT Maju Bersama (Opsional)"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="message" className="text-sm font-semibold">Pesan Anda <span className="text-destructive">*</span></label>
                <textarea 
                  id="message"
                  rows={5}
                  {...register("message")}
                  className={`w-full p-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all ${errors.message ? 'border-destructive' : 'border-border'}`}
                  placeholder="Jelaskan kebutuhan operasional tim Anda..."
                />
                {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
              </div>

              <Button 
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full h-14 rounded-xl text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all group"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Mengirim...
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    Kirim Pesan Sekarang
                    <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="max-w-6xl mx-auto mt-16"
        >
          <div className="p-4 rounded-3xl border border-border/50 bg-card shadow-sm overflow-hidden">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=106.815,-6.225,106.835,-6.210&layer=mapnik&marker=-6.2175,106.825"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: 12 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Kantor TeamVora - Jakarta Selatan"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
