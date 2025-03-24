
import React, { useEffect } from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import AgentRegistrationForm from '@/components/forms/AgentRegistrationForm';
import { useAgentRegistration } from '@/hooks/useAgentRegistration';
import { useAuthCheck } from '@/hooks/useAuthCheck';

const AgentRegistration = () => {
  const { userId, isLoading: authLoading } = useAuthCheck();
  const {
    fullName,
    setFullName,
    phoneNumber,
    setPhoneNumber,
    nationalId,
    setNationalId,
    location,
    setLocation,
    profilePreview,
    handleFileChange,
    handleSubmit,
    isLoading,
    setUserId
  } = useAgentRegistration();

  // Update userId when authCheck completes
  useEffect(() => {
    if (userId) {
      setUserId(userId);
    }
  }, [userId, setUserId]);

  if (authLoading) {
    return (
      <AuthLayout 
        title="Authenticating" 
        subtitle="Please wait..."
      >
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Become an Agent" 
      subtitle="Complete your profile to start delivering"
    >
      <AgentRegistrationForm
        fullName={fullName}
        setFullName={setFullName}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        nationalId={nationalId}
        setNationalId={setNationalId}
        location={location}
        setLocation={setLocation}
        profilePreview={profilePreview}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
};

export default AgentRegistration;
