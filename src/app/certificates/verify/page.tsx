"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  CheckCircle,
  XCircle,
  Shield,
  Calendar,
  User,
  Award,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface VerificationResult {
  valid: boolean;
  certificate?: {
    certificateNumber: string;
    studentName: string;
    examTitle: string;
    examCategory: string;
    score: number;
    completedAt: string;
    verifiedAt: string;
  };
  message?: string;
}

export default function CertificateVerificationPage() {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const verifyCertificate = async () => {
    if (!certificateNumber.trim()) {
      toast.error("Please enter a certificate number");
      return;
    }

    setIsVerifying(true);
    setResult(null);

    try {
      const response = await fetch("/api/certificates/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ certificateNumber: certificateNumber.trim() }),
      });

      const data = await response.json();
      setResult(data);

      if (data.valid) {
        toast.success("This certificate is valid and authentic");
      } else {
        toast.error("Certificate could not be verified");
      }
    } catch (error) {
      toast.error("Failed to verify certificate. Please try again.");
      console.log(error);
    } finally {
      setIsVerifying(false);
    }
  };

  const getCategoryDisplayName = (category: string) => {
    const names = {
      amt: "Aviation Maintenance Technician",
      hostess: "Cabin Crew",
      pilot: "Pilot",
    };
    return names[category as keyof typeof names] || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Certificate Verification
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Verify the authenticity of Ethiopian Airlines training
              certificates
            </p>
          </div>

          {/* Verification Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Verify Certificate</CardTitle>
              <CardDescription>
                Enter the certificate number to verify its authenticity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certificate-number">Certificate Number</Label>
                <div className="flex space-x-2">
                  <Input
                    id="certificate-number"
                    placeholder="ET-12345678"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && verifyCertificate()}
                  />
                  <Button onClick={verifyCertificate} disabled={isVerifying}>
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Certificate numbers are in the format ET-XXXXXXXX (e.g.,
                  ET-12345678). This verification system confirms the
                  authenticity of certificates issued by Ethiopian Airlines.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Verification Result */}
          {result && (
            <Card
              className={`border-2 ${
                result.valid
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : "border-red-500 bg-red-50 dark:bg-red-950/20"
              }`}
            >
              <CardHeader>
                <div className="flex items-center space-x-2">
                  {result.valid ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                  <CardTitle
                    className={result.valid ? "text-green-800" : "text-red-800"}
                  >
                    {result.valid
                      ? "Certificate Verified"
                      : "Verification Failed"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {result.valid && result.certificate ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">
                            Student Name
                          </span>
                        </div>
                        <p className="text-lg font-semibold">
                          {result.certificate.studentName}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Score</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold">
                            {result.certificate.score}%
                          </span>
                          <Badge
                            variant={
                              result.certificate.score >= 80
                                ? "default"
                                : "secondary"
                            }
                          >
                            {result.certificate.score >= 90
                              ? "Excellent"
                              : result.certificate.score >= 80
                              ? "Good"
                              : result.certificate.score >= 70
                              ? "Satisfactory"
                              : "Pass"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium">Examination</span>
                      <p className="text-lg">{result.certificate.examTitle}</p>
                      <Badge variant="outline" className="capitalize">
                        {getCategoryDisplayName(
                          result.certificate.examCategory
                        )}
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                        <p>
                          {new Date(
                            result.certificate.completedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                        <p>
                          {new Date(
                            result.certificate.verifiedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        This certificate is authentic and was issued by
                        Ethiopian Airlines. Certificate Number:{" "}
                        <strong>{result.certificate.certificateNumber}</strong>
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      {result.message ||
                        "This certificate could not be verified. Please check the certificate number and try again."}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>About Certificate Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">How it works</h4>
                <p className="text-sm text-gray-600">
                  Our verification system checks the authenticity of
                  certificates issued by Ethiopian Airlines training programs.
                  Each certificate has a unique number that can be verified in
                  real-time.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">What you can verify</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Certificate authenticity and validity</li>
                  <li>• Student name and examination details</li>
                  <li>• Completion date and score achieved</li>
                  <li>• Training program and category</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Security</h4>
                <p className="text-sm text-gray-600">
                  All certificates are digitally signed and stored securely.
                  This verification system ensures that only genuine Ethiopian
                  Airlines certificates are recognized as valid.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
