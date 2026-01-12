import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ShieldCheck, User as UserIcon, Store, Factory } from 'lucide-react';

const ChoiceCard = ({ icon: Icon, title, description, actions }) => (
  <Card className="flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-green-500/10 text-green-700 flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <div className="flex gap-2 pt-2 flex-wrap">
      {actions}
    </div>
  </Card>
);

const AuthChoicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto max-w-5xl py-10 px-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Choose how you want to continue</h1>
        <p className="text-sm text-muted-foreground">Select your role to proceed to login or signup.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ChoiceCard
          icon={ShieldCheck}
          title="Admin"
          description="SwiftMart administration portal"
          actions={
            <>
              <Button onClick={() => navigate('/admin/login')}>Admin Login</Button>
            </>
          }
        />
        <ChoiceCard
          icon={UserIcon}
          title="User"
          description="Shop and manage your account"
          actions={
            <>
              <Button variant="secondary" onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/signup')}>Sign Up</Button>
            </>
          }
        />
        <ChoiceCard
          icon={Store}
          title="Seller"
          description="Manage your store and products"
          actions={
            <>
              <Button variant="secondary" onClick={() => navigate('/seller/login')}>Login</Button>
              <Button onClick={() => navigate('/seller/signup')}>Sign Up</Button>
            </>
          }
        />
        <ChoiceCard
          icon={Factory}
          title="Industry"
          description="Bulk procurement and inventory"
          actions={
            <>
              <Button variant="secondary" onClick={() => navigate('/industry/login')}>Login</Button>
              <Button onClick={() => navigate('/industry/signup')}>Sign Up</Button>
            </>
          }
        />
      </div>
    </div>
  );
};

export default AuthChoicePage;
