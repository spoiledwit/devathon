import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog'
import toast from 'react-hot-toast';

const ShowMap = ({ lat, lng, isOpen, onClose }: { lat: string; lng: string; isOpen: boolean; onClose: any }) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    const copyCoordinates = () => {
        const coordinates = `${lat}, ${lng}`;
        navigator.clipboard.writeText(coordinates);
        toast.success('Coordinates copied to clipboard');
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='w-[80vw] max-w-[80vw] h-[70vh]'>
                <div className="flex-1 h-[55vh]">
                    <iframe
                        title="Google Maps"
                        src={googleMapsUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allowFullScreen
                        aria-hidden="false"
                    ></iframe>
                </div>
                <Button
                    onClick={copyCoordinates}
                    className='bg-primary'>
                    Copy coordinates
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default ShowMap