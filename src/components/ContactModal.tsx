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
        
        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Interested in <span className="font-semibold text-foreground">{carTitle}</span>?
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Get in touch with our sales team for more details and scheduling a viewing.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleCall}
              className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90"
            >
              <Phone className="h-4 w-4" />
              <span>Call {phoneNumber}</span>
            </Button>

            <Button
              onClick={handleEmail}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Mail className="h-4 w-4" />
              <span>Email {email}</span>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};