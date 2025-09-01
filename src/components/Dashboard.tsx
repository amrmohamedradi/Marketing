import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Users, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  MoreVertical,
  Eye,
  Calendar,
  DollarSign,
  Building,
  Mail,
  Phone
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useAppContext } from '@/lib/AppContext';
import { useNavigate } from 'react-router-dom';
import Starfield from '@/components/Starfield';

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  description: string;
  createdAt: Date;
  lastModified: Date;
  status: 'active' | 'inactive' | 'pending';
  totalValue: number;
  currency: string;
}

const Dashboard = () => {
  const { t } = useI18n();
  const { clearFormData } = useAppContext();
  const navigate = useNavigate();
  
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'أحمد محمد',
      company: 'شركة التقنية المتقدمة',
      email: 'ahmed@techadvanced.com',
      phone: '+965 2228 4398',
      description: 'تطوير موقع إلكتروني متكامل للشركة',
      createdAt: new Date('2024-01-15'),
      lastModified: new Date('2024-01-20'),
      status: 'active',
      totalValue: 5000,
      currency: 'USD'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      company: 'Digital Solutions Inc',
      email: 'sarah@digitalsolutions.com',
      phone: '+1 555 123 4567',
      description: 'Complete digital marketing package',
      createdAt: new Date('2024-01-10'),
      lastModified: new Date('2024-01-18'),
      status: 'pending',
      totalValue: 3500,
      currency: 'USD'
    },
    {
      id: '3',
      name: 'محمد العلي',
      company: 'مؤسسة الإبداع',
      email: 'mohammed@creativity.com',
      phone: '+966 11 234 5678',
      description: 'تصميم هوية بصرية كاملة',
      createdAt: new Date('2024-01-05'),
      lastModified: new Date('2024-01-15'),
      status: 'active',
      totalValue: 2800,
      currency: 'SAR'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateNew = () => {
    clearFormData();
    navigate('/');
  };

  const handleEditClient = (clientId: string) => {
    // In a real app, you'd load the client data into the form
    const client = clients.find(c => c.id === clientId);
    if (client) {
      // For demo, just navigate to form with client data
      navigate('/', { state: { editingClient: client } });
    }
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  const handleViewSpec = (clientId: string) => {
    navigate(`/read/${clientId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      SAR: 'ر.س',
      AED: 'د.إ',
      KWD: 'د.ك'
    };
    return `${symbols[currency] || currency} ${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Space Background */}
      <div className="fixed inset-0 z-0">
        <Starfield 
          className="absolute inset-0"
          starCount={400}
          maxStarSize={3}
          parallaxStrength={0.1}
          speed={0.05}
          moonSizeFactor={1.2}
          moonColor="rgba(220, 220, 240, 0.8)"
          mouseParallaxStarsFraction={0.7}
        />
        
        {/* Additional cosmic elements */}
        <div className="absolute inset-0">
          {/* Nebula clouds */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 0.9, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1, 0.8, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-pink-500/10 rounded-full blur-3xl"
          />
          
          {/* Shooting stars */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 200, 400],
                y: [0, -100, -200],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{t('client_dashboard')}</h1>
              <p className="text-muted-foreground">{t('manage_clients_specs')}</p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('create_new_client')}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="card-neo border-primary/20 hover:border-primary/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('total_clients')}</p>
                  <p className="text-2xl font-bold text-white">{clients.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-neo border-accent/20 hover:border-accent/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('active_projects')}</p>
                  <p className="text-2xl font-bold text-white">
                    {clients.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <Building className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-neo border-green-500/20 hover:border-green-500/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('total_value')}</p>
                  <p className="text-2xl font-bold text-white">
                    ${clients.reduce((sum, c) => sum + c.totalValue, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-6"
        >
          <Card className="card-neo border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={t('search_clients')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {['all', 'active', 'pending', 'inactive'].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status as any)}
                      className="capitalize"
                    >
                      {t(status)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Clients Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="card-neo border-border/50 hover:border-primary/30 transition-all duration-300 h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white mb-1 group-hover:text-primary transition-colors">
                          {client.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{client.company}</p>
                      </div>
                      <Badge className={`${getStatusColor(client.status)} text-xs`}>
                        {t(client.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{client.phone}</span>
                      </div>
                    </div>

                    {/* Project Value */}
                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">{t('project_value')}</span>
                      <span className="font-semibold text-green-400">
                        {formatCurrency(client.totalValue, client.currency)}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {client.description}
                    </p>

                    {/* Dates */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{t('created')}: {client.createdAt.toLocaleDateString()}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewSpec(client.id)}
                        className="flex-1 hover:bg-primary/10 hover:border-primary/30"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {t('view')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClient(client.id)}
                        className="flex-1 hover:bg-accent/10 hover:border-accent/30"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        {t('edit')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClient(client.id)}
                        className="hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="card-neo p-8 max-w-md mx-auto">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm || statusFilter !== 'all' ? t('no_clients_found') : t('no_clients_yet')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? t('try_different_search') 
                  : t('create_first_client')}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button
                  onClick={handleCreateNew}
                  className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t('create_new_client')}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;