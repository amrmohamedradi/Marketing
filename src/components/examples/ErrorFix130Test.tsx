import React from 'react';
import { i18nText } from '@/lib/i18nText';

// Test component to verify React Error #130 fixes
export default function ErrorFix130Test() {
  // Test data that could cause React Error #130
  const testClient = {
    name: { ar: "أحمد محمد", en: "Ahmed Mohamed" },
    company: { ar: "شركة التقنية", en: "Tech Company" },
    email: "test@example.com",
    phone: "+1234567890",
    description: { ar: "وصف المشروع", en: "Project description" }
  };

  const testLang = 'en';

  // Safe text extraction functions (like in AboutClientPreview)
  const getName = () => i18nText(testClient.name, testLang);
  const getCompany = () => i18nText(testClient.company, testLang);
  const getEmail = () => i18nText(testClient.email, testLang);
  const getPhone = () => i18nText(testClient.phone, testLang);
  const getDescription = () => i18nText(testClient.description, testLang);

  return (
    <div className="p-6 space-y-4 border rounded-lg max-w-md mx-auto">
      <h3 className="font-bold text-lg">React Error #130 Fix Test</h3>
      
      <div className="space-y-2">
        {getName() && (
          <div>
            <strong>Name:</strong> {getName()}
          </div>
        )}
        
        {getCompany() && (
          <div>
            <strong>Company:</strong> {getCompany()}
          </div>
        )}
        
        {getEmail() && (
          <div>
            <strong>Email:</strong> {getEmail()}
          </div>
        )}
        
        {getPhone() && (
          <div>
            <strong>Phone:</strong> {getPhone()}
          </div>
        )}
        
        {getDescription() && (
          <div>
            <strong>Description:</strong> {getDescription()}
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 mt-4">
        <strong>Original Data (Debug):</strong>
        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
          {JSON.stringify(testClient, null, 2)}
        </pre>
      </div>
    </div>
  );
}