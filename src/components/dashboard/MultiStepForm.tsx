"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface MultiStepFormProps {
  onSubmit: (data: ProjectFormData) => void;
  submitting: boolean;
}

export interface ProjectFormData {
  firstName: string;
  lastName: string;
  brandName: string;
  brandDetails: string;
  projectDescription: string;
}

export default function MultiStepForm({ onSubmit, submitting }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { theme } = useTheme();
  const [formData, setFormData] = useState<ProjectFormData>({
    firstName: "",
    lastName: "",
    brandName: "",
    brandDetails: "",
    projectDescription: "",
  });

  const totalSteps = 3;

  const updateFormData = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName.trim() !== "" && formData.lastName.trim() !== "";
      case 2:
        return formData.brandName.trim() !== "" && formData.brandDetails.trim() !== "";
      case 3:
        return formData.projectDescription.trim() !== "";
      default:
        return false;
    }
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                  step <= currentStep
                    ? theme === "light"
                      ? "bg-gradient-to-r from-[#E0562B] to-[#C9471F] text-white"
                      : "bg-gradient-to-r from-[#E0562B] to-[#C9471F] text-white"
                    : theme === "light"
                    ? "bg-gray-200 text-gray-400"
                    : "bg-white/10 text-gray-500"
                }`}
              >
                {step < currentStep ? <Check size={20} /> : step}
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded transition-all ${
                    step < currentStep
                      ? "bg-gradient-to-r from-[#E0562B] to-[#C9471F]"
                      : theme === "light"
                      ? "bg-gray-200"
                      : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs">
          <span className={currentStep === 1 ? (theme === "light" ? "text-[#E0562B] font-semibold" : "text-[#EFA163] font-semibold") : (theme === "light" ? "text-gray-500" : "text-gray-400")}>Personal Info</span>
          <span className={currentStep === 2 ? (theme === "light" ? "text-[#E0562B] font-semibold" : "text-[#EFA163] font-semibold") : (theme === "light" ? "text-gray-500" : "text-gray-400")}>Brand Details</span>
          <span className={currentStep === 3 ? (theme === "light" ? "text-[#E0562B] font-semibold" : "text-[#EFA163] font-semibold") : (theme === "light" ? "text-gray-500" : "text-gray-400")}>Project Description</span>
        </div>
      </div>

      {/* Form Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="firstName" className={`mb-2 block text-sm font-medium ${theme === "light" ? "text-[#123A9C]" : "text-gray-300"}`}>
                  First Name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  required
                  className={`w-full rounded-xl border p-4 focus:outline-none focus:ring-2 transition-all ${
                    theme === "light"
                      ? "border-gray-300 bg-white text-[#123A9C] placeholder-gray-400 focus:border-[#E0562B] focus:ring-[#E0562B]/20"
                      : "border-white/10 bg-black/50 text-white placeholder-gray-500 focus:border-[#E0562B] focus:ring-[#E0562B]/20"
                  }`}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className={`mb-2 block text-sm font-medium ${theme === "light" ? "text-[#123A9C]" : "text-gray-300"}`}>
                  Last Name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  required
                  className={`w-full rounded-xl border p-4 focus:outline-none focus:ring-2 transition-all ${
                    theme === "light"
                      ? "border-gray-300 bg-white text-[#123A9C] placeholder-gray-400 focus:border-[#E0562B] focus:ring-[#E0562B]/20"
                      : "border-white/10 bg-black/50 text-white placeholder-gray-500 focus:border-[#E0562B] focus:ring-[#E0562B]/20"
                  }`}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="brandName" className={`mb-2 block text-sm font-medium ${theme === "light" ? "text-[#123A9C]" : "text-gray-300"}`}>
                  Brand Name *
                </label>
                <input
                  id="brandName"
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => updateFormData("brandName", e.target.value)}
                  required
                  className={`w-full rounded-xl border p-4 focus:outline-none focus:ring-2 transition-all ${
                    theme === "light"
                      ? "border-gray-300 bg-white text-[#123A9C] placeholder-gray-400 focus:border-[#E0562B] focus:ring-[#E0562B]/20"
                      : "border-white/10 bg-black/50 text-white placeholder-gray-500 focus:border-[#E0562B] focus:ring-[#E0562B]/20"
                  }`}
                  placeholder="Enter your brand name"
                />
              </div>
              <div>
                <label htmlFor="brandDetails" className={`mb-2 block text-sm font-medium ${theme === "light" ? "text-[#123A9C]" : "text-gray-300"}`}>
                  Brand Details *
                </label>
                <textarea
                  id="brandDetails"
                  value={formData.brandDetails}
                  onChange={(e) => updateFormData("brandDetails", e.target.value)}
                  required
                  rows={4}
                  className={`w-full rounded-xl border p-4 focus:outline-none focus:ring-2 transition-all ${
                    theme === "light"
                      ? "border-gray-300 bg-white text-[#123A9C] placeholder-gray-400 focus:border-[#E0562B] focus:ring-[#E0562B]/20"
                      : "border-white/10 bg-black/50 text-white placeholder-gray-500 focus:border-[#E0562B] focus:ring-[#E0562B]/20"
                  }`}
                  placeholder="Tell us about your brand, its values, target audience, etc."
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="projectDescription" className={`mb-2 block text-sm font-medium ${theme === "light" ? "text-[#123A9C]" : "text-gray-300"}`}>
                  Project Description *
                </label>
                <textarea
                  id="projectDescription"
                  value={formData.projectDescription}
                  onChange={(e) => updateFormData("projectDescription", e.target.value)}
                  required
                  rows={8}
                  className={`w-full rounded-xl border p-4 focus:outline-none focus:ring-2 transition-all ${
                    theme === "light"
                      ? "border-gray-300 bg-white text-[#123A9C] placeholder-gray-400 focus:border-[#E0562B] focus:ring-[#E0562B]/20"
                      : "border-white/10 bg-black/50 text-white placeholder-gray-500 focus:border-[#E0562B] focus:ring-[#E0562B]/20"
                  }`}
                  placeholder="Describe your project in detail. Include your goals, preferences, specific requirements, deadlines, budget considerations, etc."
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            currentStep === 1
              ? "opacity-0 pointer-events-none"
              : theme === "light"
              ? "border-2 border-gray-300 text-[#123A9C] hover:border-[#E0562B] hover:text-[#E0562B]"
              : "border-2 border-white/20 text-gray-300 hover:border-[#E0562B] hover:text-[#EFA163]"
          }`}
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={!isStepValid()}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all ${
              isStepValid()
                ? "bg-gradient-to-r from-[#E0562B] to-[#C9471F] hover:from-[#C9471F] hover:to-[#89100D] hover:shadow-[0_4px_20px_rgba(224,86,43,0.4)] hover:scale-105"
                : "bg-gray-400 cursor-not-allowed opacity-50"
            }`}
          >
            Next
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isStepValid() || submitting}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all ${
              isStepValid() && !submitting
                ? "bg-gradient-to-r from-[#E0562B] to-[#C9471F] hover:from-[#C9471F] hover:to-[#89100D] hover:shadow-[0_4px_20px_rgba(224,86,43,0.4)] hover:scale-105"
                : "bg-gray-400 cursor-not-allowed opacity-50"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Request"}
            <Check size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
