"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getServices, createProject, Service } from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import MultiStepForm, { ProjectFormData } from "@/components/dashboard/MultiStepForm";

export default function ServiceDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { theme } = useTheme();

    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadService() {
            try {
                const services = await getServices();
                const found = services.find(s => s.id === id);
                setService(found || null);
            } catch (error) {
                console.error("Failed to load service", error);
            } finally {
                setLoading(false);
            }
        }
        loadService();
    }, [id]);

    const handleSubmit = async (formData: ProjectFormData) => {
        if (!service) return;

        setSubmitting(true);
        setError(null);

        try {
            // Combine all form data into requirements text
            const requirements = `
Name: ${formData.firstName} ${formData.lastName}
Brand: ${formData.brandName}

Brand Details:
${formData.brandDetails}

Project Description:
${formData.projectDescription}
            `.trim();

            await createProject(service.id as any, requirements);
            router.push("/dashboard/requests");
        } catch (err: any) {
            setError(err.message || "Failed to submit request");
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className={`h-8 w-8 animate-spin ${theme === "light" ? "text-[#E0562B]" : "text-[#EFA163]"}`} />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center">
                <h2 className={`text-2xl font-bold ${theme === "light" ? "text-[#123A9C]" : "text-white"}`}>
                    Service not found
                </h2>
                <Link href="/dashboard" className={`mt-4 ${theme === "light" ? "text-[#E0562B] hover:text-[#C9471F]" : "text-[#EFA163] hover:text-[#E0562B]"}`}>
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center p-8 pt-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <Link 
                    href="/dashboard" 
                    className={`mb-8 inline-flex items-center text-sm transition-colors ${
                        theme === "light" ? "text-gray-600 hover:text-[#E0562B]" : "text-gray-400 hover:text-white"
                    }`}
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Services
                </Link>

                <div className="mb-8">
                    <h1 className={`mb-2 text-3xl font-bold ${theme === "light" ? "text-[#123A9C]" : "text-white"}`}>
                        {service.name}
                    </h1>
                    <p className={theme === "light" ? "text-gray-600" : "text-gray-400"}>
                        {service.description}
                    </p>
                </div>

                <div className={`rounded-2xl border p-8 backdrop-blur-sm ${
                    theme === "light"
                        ? "border-gray-200 bg-white shadow-lg"
                        : "border-white/10 bg-white/5"
                }`}>
                    {error && (
                        <div className={`mb-6 rounded-lg p-4 text-sm ${
                            theme === "light"
                                ? "bg-red-50 text-red-600"
                                : "bg-red-500/10 text-red-400"
                        }`}>
                            {error}
                        </div>
                    )}

                    <MultiStepForm onSubmit={handleSubmit} submitting={submitting} />
                </div>
            </motion.div>
        </div>
    );
}
