"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  Share2,
  ArrowLeft,
  Award,
  Calendar,
  Trophy,
  Star,
  CheckCircle,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { use } from "react";

interface CertificateData {
  id: string;
  examTitle: string;
  examCategory: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  certificateNumber: string;
  grade: string;
  timeSpent: number;
  difficulty: string;
}

export default function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get certificate data from localStorage or API
    const examResults = localStorage.getItem("examResults");
    if (examResults) {
      const results = JSON.parse(examResults);

      // Generate certificate data
      const certificateData: CertificateData = {
        id: id,
        examTitle: results.exam.title,
        examCategory: results.exam.category,
        studentName: "John Doe", // Would come from session
        score: results.score.percentage,
        totalQuestions: results.score.total,
        correctAnswers: results.score.correct,
        completedAt: results.completedAt,
        certificateNumber: `ET-${Date.now().toString().slice(-8)}`,
        grade: getGrade(results.score.percentage),
        timeSpent: results.timeSpent || 0,
        difficulty: results.exam.difficulty || "medium",
      };

      setCertificate(certificateData);
    }
    setIsLoading(false);
  }, [id]);

  const getGrade = (score: number): string => {
    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 85) return "A-";
    if (score >= 80) return "B+";
    if (score >= 75) return "B";
    if (score >= 70) return "B-";
    if (score >= 65) return "C+";
    if (score >= 60) return "C";
    return "F";
  };

  const getCategoryDisplayName = (category: string) => {
    const names = {
      amt: "Aviation Maintenance Technician",
      hostess: "Cabin Crew",
      pilot: "Pilot",
    };
    return names[category as keyof typeof names] || category;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const downloadCertificate = () => {
    // In a real implementation, this would generate a PDF
    toast.success("Your certificate is being prepared for download");
  };

  const shareCertificate = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Ethiopian Airlines Certificate",
        text: `I just earned a certificate in ${certificate?.examTitle}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Certificate link copied to clipboard");
    }
  };

  const printCertificate = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p className="text-muted-foreground">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p className="text-muted-foreground">Certificate not found</p>
          <Button onClick={() => router.push("/exams")} className="mt-4">
            Back to Exams
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4">
        {/* Header Actions */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
          <Button
            variant="ghost"
            onClick={() => router.push("/exams")}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exams
          </Button>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={downloadCertificate} className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button
              onClick={shareCertificate}
              variant="outline"
              className="flex items-center"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              onClick={printCertificate}
              variant="outline"
              className="flex items-center"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Certificate */}
        <Card className="max-w-4xl mx-auto bg-white shadow-2xl border-8 border-double border-blue-600 print:shadow-none print:border-4">
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Award className="h-16 w-16 text-yellow-300" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              CERTIFICATE OF COMPLETION
            </h1>
            <p className="text-xl opacity-90">
              Ethiopian Airlines Training Program
            </p>
          </div>

          <CardContent className="p-12">
            {/* Certificate Body */}
            <div className="text-center space-y-8">
              {/* Recipient */}
              <div className="space-y-4">
                <p className="text-lg text-gray-600">This is to certify that</p>
                <h2 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 inline-block">
                  {certificate.studentName}
                </h2>
                <p className="text-lg text-gray-600">
                  has successfully completed the examination
                </p>
              </div>

              {/* Exam Details */}
              <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">
                  {certificate.examTitle}
                </h3>
                <p className="text-lg text-gray-700 mb-4">
                  {getCategoryDisplayName(certificate.examCategory)}{" "}
                  Certification Program
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {certificate.score}%
                    </div>
                    <div className="text-sm text-gray-600">Final Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {certificate.grade}
                    </div>
                    <div className="text-sm text-gray-600">Grade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {certificate.correctAnswers}/{certificate.totalQuestions}
                    </div>
                    <div className="text-sm text-gray-600">Correct Answers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {formatTime(certificate.timeSpent)}
                    </div>
                    <div className="text-sm text-gray-600">Time Taken</div>
                  </div>
                </div>
              </div>

              {/* Achievement Level */}
              <div className="flex items-center justify-center space-x-2">
                {certificate.score >= 90 && (
                  <>
                    <Star className="h-6 w-6 text-yellow-500 fill-current" />
                    <span className="text-lg font-semibold text-yellow-600">
                      Excellence Award
                    </span>
                    <Star className="h-6 w-6 text-yellow-500 fill-current" />
                  </>
                )}
                {certificate.score >= 80 && certificate.score < 90 && (
                  <>
                    <Trophy className="h-6 w-6 text-silver-500" />
                    <span className="text-lg font-semibold text-gray-600">
                      Merit Award
                    </span>
                    <Trophy className="h-6 w-6 text-silver-500" />
                  </>
                )}
                {certificate.score >= 70 && certificate.score < 80 && (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="text-lg font-semibold text-green-600">
                      Completion Award
                    </span>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </>
                )}
              </div>

              {/* Date and Certificate Number */}
              <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t-2 border-gray-200">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-600">Date of Completion</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {new Date(certificate.completedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <div className="text-gray-600">Certificate Number</div>
                  <div className="text-lg font-semibold font-mono">
                    {certificate.certificateNumber}
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className="text-center">
                  <div className="border-t-2 border-gray-400 pt-2 mt-8">
                    <p className="font-semibold">Training Director</p>
                    <p className="text-sm text-gray-600">Ethiopian Airlines</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t-2 border-gray-400 pt-2 mt-8">
                    <p className="font-semibold">Chief Examiner</p>
                    <p className="text-sm text-gray-600">
                      Aviation Training Center
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Certificate Footer */}
          <div className="bg-gray-100 p-6 text-center border-t">
            <p className="text-sm text-gray-600">
              This certificate verifies that the above-named individual has
              successfully completed the Ethiopian Airlines{" "}
              {getCategoryDisplayName(certificate.examCategory)} examination
              with a score of {certificate.score}% and has demonstrated
              competency in the required areas.
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>Certificate ID: {certificate.certificateNumber}</span>
              <span>•</span>
              <span>Issued: {new Date().toLocaleDateString()}</span>
              <span>•</span>
              <span>Valid: Lifetime</span>
            </div>
          </div>
        </Card>

        {/* Additional Information */}
        <div className="max-w-4xl mx-auto mt-8 print:hidden">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Verification</h4>
                  <p className="text-sm text-gray-600">
                    This certificate can be verified using the certificate
                    number:
                    <span className="font-mono font-semibold">
                      {" "}
                      {certificate.certificateNumber}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Validity</h4>
                  <p className="text-sm text-gray-600">
                    This certificate is valid for life and demonstrates
                    successful completion of the Ethiopian Airlines training
                    examination.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
