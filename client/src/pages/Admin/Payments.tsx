import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign, Calendar, CheckCircle, Search, Edit, Trash2 } from 'lucide-react';

const PaymentWidget = ({ icon: Icon, label, value, bgColor, iconColor, textColor }: any) => (
  <div className={`${bgColor} p-4 rounded-lg`}>
    <div className="flex items-center">
      <Icon className={`${iconColor} h-8 w-8 mr-3`} />
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={`text-2xl font-semibold ${textColor}`}>{value}</p>
      </div>
    </div>
  </div>
);

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStats, setPaymentStats] = useState({
    totalAmount: 0,
    totalPayments: 0,
    approvedPayments: 0,
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URI}/payment`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setPayments(response.data.payment);
        setFilteredPayments(response.data.payments);
        calculateStats(response.data.payments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  const calculateStats = (paymentData: any) => {
    const stats = paymentData.reduce((acc: any, payment: any) => {
      acc.totalAmount += payment.amount;
      acc.totalPayments += 1;
      if (payment.paymentStatus === 'approved') {
        acc.approvedPayments += 1;
      }
      return acc;
    }, { totalAmount: 0, totalPayments: 0, approvedPayments: 0 });

    setPaymentStats(stats);
  };

  const handleSearch = (event: any) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = payments.filter(payment => 
      //@ts-ignore
      payment.ticketId.toLowerCase().includes(term) ||
      //@ts-ignore
      payment.stripeId.toLowerCase().includes(term)
    );
    setFilteredPayments(filtered);
  };

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Payment Management</h1>
        <div className="relative w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <PaymentWidget
          icon={DollarSign}
          label="Total Amount"
          value={formatAmount(paymentStats.totalAmount)}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
          textColor="text-blue-600"
        />
        <PaymentWidget
          icon={Calendar}
          label="Total Payments"
          value={paymentStats.totalPayments}
          bgColor="bg-green-100"
          iconColor="text-green-600"
          textColor="text-green-600"
        />
        <PaymentWidget
          icon={CheckCircle}
          label="Approved Payments"
          value={paymentStats.approvedPayments}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
          textColor="text-purple-600"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments Table</CardTitle>
          <CardDescription>Manage your payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Ticket ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Stripe ID</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment:any) => (
                  <TableRow key={payment._id}>
                    <TableCell className="font-medium">{payment.ticketId}</TableCell>
                    <TableCell>{formatAmount(payment.amount)}</TableCell>
                    <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                    <TableCell>{payment.stripeId}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        payment.paymentStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.paymentStatus}
                      </span>
                    </TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}