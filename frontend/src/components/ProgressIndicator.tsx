import React from 'react';
import { formConfig } from '../config/formConfig';
import styles from './ProgressIndicator.module.css';

interface Props {
  completedSections: string[];
  currentSection: string;
}

export const ProgressIndicator: React.FC<Props> = ({ completedSections, currentSection }) => {
  return (
    <div className={styles.progressContainer}>
      {Object.entries(formConfig.sections).map(([sectionId, section]) => (
        <div key={sectionId} className={styles.progressItem}>
          <div 
            className={`${styles.circle} ${
              completedSections.includes(sectionId) ? styles.completed : ''
            } ${currentSection === sectionId ? styles.current : ''}`}
          >
            {completedSections.includes(sectionId) ? '✓' : ''}
          </div>
          <span className={styles.sectionLabel}>{section.title}</span>
        </div>
      ))}
    </div>
  );
}; 