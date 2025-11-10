import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, CheckCircle, AlertCircle, Users, TrendingUp, Clock, Calendar } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Requirements',
      value: '24',
      icon: FileText,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Pending Reviews',
      value: '7',
      icon: AlertCircle,
      trend: '-3%',
      trendUp: false,
    },
    {
      title: 'Approved',
      value: '15',
      icon: CheckCircle,
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Active Users',
      value: '12',
      icon: Users,
      trend: '+2',
      trendUp: true,
    },
  ];

  // Requirement Status Distribution Data
  const statusData = [
    { name: 'Draft', value: 5, color: 'hsl(var(--muted-foreground))' },
    { name: 'In Review', value: 7, color: 'hsl(var(--warning))' },
    { name: 'Approved', value: 15, color: 'hsl(var(--success))' },
    { name: 'Rejected', value: 2, color: 'hsl(var(--destructive))' },
    { name: 'Implemented', value: 8, color: 'hsl(var(--info))' },
  ];

  // Priority Breakdown Data
  const priorityData = [
    { priority: 'High', count: 8, fill: 'hsl(var(--destructive))' },
    { priority: 'Medium', count: 12, fill: 'hsl(var(--warning))' },
    { priority: 'Low', count: 4, fill: 'hsl(var(--success))' },
  ];

  // Review Queue Data
  const reviewQueue = [
    { id: 'REQ-089', title: 'User Authentication System', dueDate: '2024-01-15', priority: 'high', reviewer: 'Sarah Chen' },
    { id: 'REQ-090', title: 'Payment Gateway Integration', dueDate: '2024-01-16', priority: 'high', reviewer: 'Mike Johnson' },
    { id: 'REQ-091', title: 'Email Notification Service', dueDate: '2024-01-18', priority: 'medium', reviewer: 'Emily Brown' },
    { id: 'REQ-092', title: 'Dashboard Analytics', dueDate: '2024-01-20', priority: 'medium', reviewer: 'Carlos Rodriguez' },
  ];

  // Project Health Metrics
  const projectHealth = {
    completionRate: 68,
    qualityScore: 85,
    velocityTrend: 'up',
    blockedItems: 3,
  };

  const chartConfig = {
    status: {
      label: 'Requirements by Status',
    },
    priority: {
      label: 'Requirements by Priority',
    },
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your requirements today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="flex items-center mt-2 text-xs">
                  <TrendingUp className={`w-3 h-3 mr-1 ${stat.trendUp ? 'text-success' : 'text-destructive'}`} />
                  <span className={stat.trendUp ? 'text-success' : 'text-destructive'}>
                    {stat.trend}
                  </span>
                  <span className="text-muted-foreground ml-1">vs last week</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Requirement Status Distribution</CardTitle>
            <CardDescription>Overview of requirements by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Priority Breakdown Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Breakdown</CardTitle>
            <CardDescription>Requirements distribution by priority</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="priority" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Review Queue & Project Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Review Queue */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Review Queue</CardTitle>
                <CardDescription>Pending requirements awaiting review</CardDescription>
              </div>
              <Badge variant="secondary">{reviewQueue.length} pending</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviewQueue.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-muted-foreground">{item.id}</span>
                      <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">Assigned to {item.reviewer}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{item.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Health Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Project Health</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm font-bold">{projectHealth.completionRate}%</span>
              </div>
              <Progress value={projectHealth.completionRate} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Quality Score</span>
                <span className="text-sm font-bold text-success">{projectHealth.qualityScore}%</span>
              </div>
              <Progress value={projectHealth.qualityScore} className="h-2" />
            </div>

            <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">Velocity Trend</span>
              </div>
              <Badge variant="outline" className="text-success border-success">Improving</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium">Blocked Items</span>
              </div>
              <span className="text-lg font-bold text-destructive">{projectHealth.blockedItems}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates across all projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-accent transition-colors">
              <div className="w-2 h-2 bg-success rounded-full mt-2" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">REQ-087 approved by Carlos Rodriguez</p>
                  <Badge variant="outline" className="text-xs">Approved</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-accent transition-colors">
              <div className="w-2 h-2 bg-info rounded-full mt-2" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">New requirement REQ-088 created</p>
                  <Badge variant="outline" className="text-xs">New</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  4 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-accent transition-colors">
              <div className="w-2 h-2 bg-warning rounded-full mt-2" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Change request CR-015 submitted</p>
                  <Badge variant="outline" className="text-xs">Pending</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Yesterday
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-accent transition-colors">
              <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Review session completed for Sprint 3 requirements</p>
                  <Badge variant="outline" className="text-xs">Completed</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  2 days ago
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
