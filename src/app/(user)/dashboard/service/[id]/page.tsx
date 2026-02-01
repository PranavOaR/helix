"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getServices, createProject, Service } from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

export default function ServiceDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [requirements, setRequirements] = useState("");
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!service) return;

        setSubmitting(true);
        setError(null);

        try {
            // Cast service.id to the allowed type or update createProject to accept string
            // Assuming createProject accepts string based on usage, but type might restrict it
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
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-white">Service not found</h2>
                <Link href="/dashboard" className="mt-4 text-purple-400 hover:text-purple-300">
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
                <Link href="/dashboard" className="mb-8 inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Services
                </Link>

                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-white">{service.name}</h1>
                    <p className="text-gray-400">{service.description}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="requirements" className="mb-2 block text-sm font-medium text-gray-300">
                                Project Requirements
                            </label>
                            <textarea
                                id="requirements"
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                required
                                rows={6}
                                className="w-full rounded-xl border border-white/10 bg-black/50 p-4 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                placeholder="Describe your project, preferences, and any specific requirements..."
                            />
                        </div>

                        {error && (
                            <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Submitting Request...
                                </>
                            ) : (
                                "Submit Request"
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
