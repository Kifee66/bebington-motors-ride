import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  carTitle: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, carTitle }) => {
  const phoneNumber = "0704400418";
  const email = "kevinbebington9@gmail.com";

  const handleCall = () => {
    window.open(`tel:${phoneNumber}`);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Inquiry about ${carTitle}`);
    const body = encodeURIComponent(`Hi, I'm interested in the ${carTitle}. Could you please provide more details?`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  const handleSMS = () => {
    const message = encodeURIComponent(`Hi, I'm interested in the ${carTitle}. Could you please provide more details?`);
    window.open(`sms:${phoneNumber}?body=${message}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-foreground">Contact Seller</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              Interested in <span className="font-semibold text-foreground">{carTitle}</span>?
            </p>
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20 mb-4">
              <p className="text-foreground font-medium">
                For more enquiries or purchase contact us:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-smooth">
              <div className="bg-primary/20 p-2 rounded-full">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Call Us</p>
                <p className="text-primary font-semibold">{phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-smooth">
              <div className="bg-primary/20 p-2 rounded-full">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Email Us</p>
                <p className="text-primary font-semibold">{email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleCall}
              className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 shadow-glow"
            >
              <Phone className="h-4 w-4" />
              <span>Call Now</span>
            </Button>

            <Button
              onClick={handleEmail}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Mail className="h-4 w-4" />
              <span>Send Email</span>
            </Button>

            <Button
              onClick={handleSMS}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Send SMS</span>
            </Button>
          </div>

          <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
            <p className="text-sm text-muted-foreground text-center">
              Our team is ready to assist you with any questions about this vehicle. 
              We look forward to helping you find your perfect car!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};