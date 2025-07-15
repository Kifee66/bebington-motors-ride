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

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in the ${carTitle}. Could you please provide more details?`);
    window.open(`https://wa.me/254${phoneNumber.slice(1)}?text=${message}`);
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
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <div className="h-4 w-4">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097"/>
                </svg>
              </div>
              <span>WhatsApp</span>
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