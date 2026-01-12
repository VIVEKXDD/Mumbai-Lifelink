'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  date: string;
  content: string;
}

interface Scheme {
  id: string;
  title: string;
  description: string;
}

function BillPayTab() {
  const [utility, setUtility] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!utility || !accountNumber || !amount) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all fields before proceeding.',
      });
      return;
    }

    setIsPaying(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPaying(false);

    toast({
      title: 'Payment Successful!',
      description: `Your payment of ₹${amount} for ${utility} has been processed.`,
    });
    
    // Reset form
    setUtility('');
    setAccountNumber('');
    setAmount('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Pay Utility Bill</CardTitle>
        <CardDescription>
          Quickly pay your electricity, water, or gas bills.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="utility-type">Utility Type</Label>
          <Select value={utility} onValueChange={setUtility}>
            <SelectTrigger id="utility-type">
              <SelectValue placeholder="Select a utility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electricity">Electricity</SelectItem>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="gas">Gas</SelectItem>
              <SelectItem value="property-tax">Property Tax</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="account-number">Account Number</Label>
          <Input
            id="account-number"
            placeholder="Enter your account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input 
            id="amount" 
            placeholder="Enter amount to pay" 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handlePayment} disabled={isPaying}>
          {isPaying ? <Loader2 className="animate-spin mr-2" /> : null}
          {isPaying ? 'Processing...' : 'Proceed to Payment'}
        </Button>
      </CardFooter>
    </Card>
  );
}

function GrievanceTab() {
  const [step, setStep] = useState(1);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">File a Grievance</CardTitle>
        <CardDescription>
          Report civic issues in your locality. Step {step} of 3.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="grievance-category">Category</Label>
              <Select>
                <SelectTrigger id="grievance-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="waste">Waste Management</SelectItem>
                  <SelectItem value="potholes">Roads & Potholes</SelectItem>
                  <SelectItem value="water">Water Supply</SelectItem>
                  <SelectItem value="streetlights">Streetlights</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grievance-description">Description</Label>
              <Textarea
                id="grievance-description"
                placeholder="Describe the issue in detail."
              />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter nearest landmark or address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo">Upload Photo (Optional)</Label>
              <Input id="photo" type="file" />
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold">Thank you!</h3>
            <p className="text-muted-foreground">
              Your grievance has been submitted. Your reference number is{' '}
              <span className="font-mono text-primary">GRV123456</span>.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        {step > 1 && step < 3 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Previous
          </Button>
        )}
        {step < 3 && (
          <Button onClick={() => setStep(step + 1)} className="ml-auto">
            {step === 2 ? 'Submit' : 'Next'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function NoticesTab() {
  const firestore = useFirestore();
  const noticesQuery = useMemoFirebase(() => collection(firestore, 'publicNotices'), [firestore]);
  const { data: mockNotices } = useCollection<Notice>(noticesQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Public Notices</CardTitle>
        <CardDescription>
          Latest updates and announcements from civic bodies.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {(mockNotices || []).map((notice) => (
              <div key={notice.id} className="p-4 border rounded-lg">
                <p className="font-semibold">{notice.title}</p>
                <p className="text-sm text-muted-foreground">{notice.date}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function SchemesTab() {
  const firestore = useFirestore();
  const schemesQuery = useMemoFirebase(() => collection(firestore, 'governmentSchemes'), [firestore]);
  const { data: mockSchemes } = useCollection<Scheme>(schemesQuery);

  const [searchQuery, setSearchQuery] = useState('');
  const filteredSchemes = useMemo(() => {
    if (!mockSchemes) return [];
    if (!searchQuery) return mockSchemes;
    return mockSchemes.filter(scheme =>
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, mockSchemes]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Government Schemes</CardTitle>
        <CardDescription>
          Find and check eligibility for government schemes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input 
          placeholder="Search for schemes..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {filteredSchemes.length > 0 ? filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="p-4 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{scheme.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {scheme.description}
                  </p>
                </div>
                <EligibilityQuiz />
              </div>
            )) : (
              <div className="text-center text-muted-foreground py-10">
                No schemes found.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function EligibilityQuiz() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Check Eligibility</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline">Eligibility Quiz</DialogTitle>
          <DialogDescription>
            Answer a few questions to check your eligibility.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Separator />
          <div className="space-y-2">
            <Label>Are you a resident of Mumbai?</Label>
            <RadioGroup defaultValue="yes">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="q1-yes" />
                <Label htmlFor="q1-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="q1-no" />
                <Label htmlFor="q1-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>What is your annual household income?</Label>
            <RadioGroup defaultValue="<5L">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="<5L" id="q2-1" />
                <Label htmlFor="q2-1">Less than 5 Lakhs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5-10L" id="q2-2" />
                <Label htmlFor="q2-2">5 to 10 Lakhs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value=">10L" id="q2-3" />
                <Label htmlFor="q2-3">More than 10 Lakhs</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <Button className="w-full">Check Now</Button>
      </DialogContent>
    </Dialog>
  );
}

export default function CivicHubPage() {
  return (
    <Tabs defaultValue="bill-pay" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="bill-pay">Bill Pay</TabsTrigger>
        <TabsTrigger value="grievance">File Grievance</TabsTrigger>
        <TabsTrigger value="notices">Public Notices</TabsTrigger>
        <TabsTrigger value="schemes">Govt. Schemes</TabsTrigger>
      </TabsList>
      <div className="mt-6">
        <TabsContent value="bill-pay">
          <BillPayTab />
        </TabsContent>
        <TabsContent value="grievance">
          <GrievanceTab />
        </TabsContent>
        <TabsContent value="notices">
          <NoticesTab />
        </TabsContent>
        <TabsContent value="schemes">
          <SchemesTab />
        </TabsContent>
      </div>
    </Tabs>
  );
}
