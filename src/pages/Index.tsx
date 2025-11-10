import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, Users, TrendingUp } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: FileText,
      title: 'Requirements Management',
      description: 'Create, edit, and track requirements throughout the development lifecycle',
    },
    {
      icon: CheckCircle,
      title: 'Review Workflows',
      description: 'Structured approval processes with multi-stakeholder collaboration',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Real-time updates, comments, and notifications for your entire team',
    },
    {
      icon: TrendingUp,
      title: 'Impact Analysis',
      description: 'Assess the ripple effects of changes across your entire system',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-3xl mb-8 shadow-lg">
            <FileText className="w-10 h-10 text-primary-foreground" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary">AREP</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Agile Requirements Engineering Platform - Your comprehensive solution for managing
            software requirements, reviews, and traceability
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="text-lg px-8"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-20 text-center">
          <p className="text-gray-600">
            Trusted by software development teams to manage requirements efficiently
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
