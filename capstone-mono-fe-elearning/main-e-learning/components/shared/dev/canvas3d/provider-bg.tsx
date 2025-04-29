'use client'
import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type BackgroundType = 'galaxy' | 'galaxyCircle' | 'neonText' | 'galaxyEntrance';

interface BackgroundContextType {
  backgroundType: BackgroundType;
  setBackgroundType: (type: BackgroundType) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const useBackground = (newBackgroundType?: BackgroundType) => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  if (newBackgroundType) {
    context.setBackgroundType(newBackgroundType);
  }
  return context;
};

interface BackgroundProviderProps {
  children: ReactNode;
  initialBackground?: BackgroundType;
}

const GalaxyBackground = dynamic(() => import('./galaxy-bg'), { ssr: false });
const GalaxyCircleBackground = dynamic(() => import('./galaxycircle-bg'), { ssr: false });
const NeonTextBackground = dynamic(() => import('./neon-text'), { ssr: false });
const GalaxyEntranceBackground = dynamic(() => import('./galaxyentrance-bg'), { ssr: false });

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({ children, initialBackground = 'galaxy' }) => {
  const [backgroundType, setBackgroundType] = useState<BackgroundType>(initialBackground);

  const contextValue = useMemo(() => ({ backgroundType, setBackgroundType }), [backgroundType]);

  const BackgroundComponent = useMemo(() => {
    switch (backgroundType) {
      case 'galaxy':
        return GalaxyBackground;
      case 'galaxyCircle':
        return GalaxyCircleBackground;
      case 'neonText':
        return () => <NeonTextBackground text="Default Text" />;
      case 'galaxyEntrance':
        return GalaxyEntranceBackground;
      default:
        return GalaxyBackground;
    }
  }, [backgroundType]);

  return (
    <BackgroundContext.Provider value={contextValue}>
      <BackgroundComponent />
      {children}
    </BackgroundContext.Provider>
  );
};

export const BackgroundSwitcher: React.FC = () => {
  const { backgroundType, setBackgroundType } = useBackground();

  const handleChange = useCallback((value: string) => {
    setBackgroundType(value as BackgroundType);
  }, [setBackgroundType]);

  const backgroundOptions: BackgroundType[] = ['galaxy', 'galaxyCircle', 'neonText', 'galaxyEntrance'];

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
      <Select value={backgroundType} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select background" />
        </SelectTrigger>
        <SelectContent>
          {backgroundOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option === 'galaxy' ? 'Galaxy' : 
               option === 'galaxyCircle' ? 'Galaxy Circle' : 
               option === 'neonText' ? 'Neon Text' : 
               'Galaxy Entrance'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={() => {
          const currentIndex = backgroundOptions.indexOf(backgroundType);
          const nextIndex = (currentIndex + 1) % backgroundOptions.length;
          setBackgroundType(backgroundOptions[nextIndex]);
        }}
        variant="outline"
      >
        Switch Background
      </Button>
    </div>
  );
};
