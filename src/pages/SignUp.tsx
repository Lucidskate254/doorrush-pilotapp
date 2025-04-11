
import React from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import SignUpForm from '@/components/forms/SignUpForm';

const SignUp = () => {
  return (
    <AuthLayout 
      title="Create an agent account" 
      subtitle="Enter your details to get started"
    >
      <SignUpForm />
    </AuthLayout>
  );
};

export default SignUp;
