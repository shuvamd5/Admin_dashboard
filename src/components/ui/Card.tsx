// components/ui/Card.tsx
import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string; // To allow passing additional classes
  // Corrected 'as' prop type
  as?: React.ElementType; // This is the correct type for dynamic JSX elements
}

const Card: React.FC<CardProps> = ({ children, className, as: Component = 'div' }) => {
  // Use the 'Component' variable which will be 'div' by default, or the tag specified by 'as'
  return (
    <Component className={`${styles.card} ${className || ''}`}>
      {children}
    </Component>
  );
};

export default Card;