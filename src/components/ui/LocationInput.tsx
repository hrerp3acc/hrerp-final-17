
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationInputProps {
  value: string;
  onValueChange: (value: string) => void;
  id?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({ value, onValueChange, id }) => {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customLocation, setCustomLocation] = useState('');

  const commonLocations = ['New York', 'San Francisco', 'Chicago', 'Boston', 'Remote', 'Los Angeles', 'Austin', 'Seattle', 'Miami', 'Denver'];

  // Check if current value is a custom location (not in common locations)
  React.useEffect(() => {
    if (value && !commonLocations.includes(value)) {
      setIsCustomMode(true);
      setCustomLocation(value);
    }
  }, [value]);

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === 'other') {
      setIsCustomMode(true);
      setCustomLocation('');
      onValueChange('');
    } else {
      setIsCustomMode(false);
      setCustomLocation('');
      onValueChange(selectedValue);
    }
  };

  const handleCustomLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomLocation(newValue);
    onValueChange(newValue);
  };

  const handleCancelCustom = () => {
    setIsCustomMode(false);
    setCustomLocation('');
    onValueChange('');
  };

  if (isCustomMode) {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>Location</Label>
        <div className="flex space-x-2">
          <Input
            id={id}
            value={customLocation}
            onChange={handleCustomLocationChange}
            placeholder="Enter custom location"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancelCustom}
            className="px-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500">Enter a custom location or click X to go back to dropdown</p>
      </div>
    );
  }

  return (
    <div>
      <Label htmlFor={id}>Location</Label>
      <Select value={value} onValueChange={handleSelectChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent>
          {commonLocations.map(location => (
            <SelectItem key={location} value={location}>{location}</SelectItem>
          ))}
          <SelectItem value="other" className="font-medium text-blue-600">
            Other... (Enter custom location)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationInput;
