import React, { useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { 
  Box, 
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import type { SectionHeaderProps } from '../types';
import { keyframes } from '@mui/system';

// Add a function to check if all items fit
const shouldShowArrows = (totalItems: number) => {
  const viewportWidth = window.innerWidth;
  const slidesToShow = viewportWidth > 1024 ? 5 : viewportWidth > 600 ? 3 : 1;
  return totalItems > slidesToShow;
};

// Custom arrow components
const NextArrow = (props: any) => {
  const { onClick, currentSlide, slideCount, slidesToShow } = props;
  const isLastSlide = currentSlide + slidesToShow >= slideCount;
  const showArrows = shouldShowArrows(slideCount);

  if (!showArrows) return null;

  return (
    <IconButton 
      onClick={onClick} 
      sx={{ 
        position: 'absolute',
        right: -40,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        opacity: isLastSlide ? 0.3 : 1,
        cursor: isLastSlide ? 'not-allowed' : 'pointer',
        '&.slick-hidden': {
          display: 'none'
        }
      }}
      disabled={isLastSlide}
    >
      <NavigateNextIcon />
    </IconButton>
  );
};

const PrevArrow = (props: any) => {
  const { onClick, currentSlide } = props;
  const isFirstSlide = currentSlide === 0;
  const showArrows = shouldShowArrows(props.slideCount);

  if (!showArrows) return null;

  return (
    <IconButton 
      onClick={onClick} 
      sx={{ 
        position: 'absolute',
        left: -40,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        opacity: isFirstSlide ? 0.3 : 1,
        cursor: isFirstSlide ? 'not-allowed' : 'pointer',
        '&.slick-hidden': {
          display: 'none'
        }
      }}
      disabled={isFirstSlide}
    >
      <NavigateBeforeIcon />
    </IconButton>
  );
};

// Add CarouselCounter component
const CarouselCounter = ({ direction, count }: { direction: 'left' | 'right', count: number }) => {
  if (count === 0) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        [direction]: -60,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        color: 'primary.main',
        fontSize: '0.875rem',
        fontWeight: 500
      }}
    >
      {direction === 'left' && <KeyboardArrowLeftIcon fontSize="small" />}
      <Typography variant="caption" color="primary">
        +{count}
      </Typography>
      {direction === 'right' && <KeyboardArrowRightIcon fontSize="small" />}
    </Box>
  );
};

// Add keyframes for the pulse animation
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

const SectionHeader: React.FC<SectionHeaderProps> = ({
  sections,
  completedSections,
  activeSection,
  onSectionClick,
  disabledSections = [],
}) => {
  const [hiddenLeft, setHiddenLeft] = useState(0);
  const [hiddenRight, setHiddenRight] = useState(0);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: false,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    focusOnSelect: false,
    variableWidth: false,
    swipe: true,
    swipeToSlide: true,
    draggable: true,
    touchThreshold: 10,
    accessibility: true,
    adaptiveHeight: false,
    useCSS: true,
    useTransform: true,
    edgeFriction: 0.35,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ],
    beforeChange: () => {
      const totalSlides = sections.length;
      const slidesToShow = window.innerWidth > 1024 ? 5 : window.innerWidth > 600 ? 3 : 1;
      
      if (totalSlides <= slidesToShow) {
        return false;
      }
    },
    afterChange: (currentSlide: number) => {
      const totalSlides = sections.length;
      const slidesToShow = window.innerWidth > 1024 ? 5 : window.innerWidth > 600 ? 3 : 1;
      
      setHiddenLeft(currentSlide);
      setHiddenRight(Math.max(0, totalSlides - currentSlide - slidesToShow));
    },
    centerPadding: '40px',  // Add padding for connectors
    className: 'section-slider',
  };

  return (
    <Box sx={{ 
      mx: 5, 
      position: 'relative',
      py: 2,
      minHeight: '120px'
    }}>
      <CarouselCounter direction="left" count={hiddenLeft} />
      <Slider {...sliderSettings}>
        {sections.map((section, index) => {
          const isCompleted = completedSections.includes(section.id);
          const isActive = section.id === activeSection;
          const isDisabled = disabledSections.includes(section.id);
          const isFirst = index === 0;
          const isAIWizard = section.id === 'ai_wizard';

          return (
            <Box key={section.id} sx={{ 
              px: 2,
              py: 1.5
            }}>
              <Box sx={{ 
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 25,
                  left: '-50%',
                  right: '50%',
                  height: 2,
                  bgcolor: isCompleted ? 'success.main' : 
                          isActive ? 'primary.main' : 
                          'grey.300',
                  zIndex: 0,
                  display: isFirst ? 'none' : 'block'
                }
              }}>
                <Tooltip 
                  title={isAIWizard ? 
                    "You can modify your study phase and data collection type in the header above" : 
                    ""}
                  arrow
                  placement="top"
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box
                      onClick={() => !isAIWizard && !isDisabled && onSectionClick(section.id)}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: isActive ? 'primary.main' : 'background.paper',
                        border: 1,
                        borderColor: isCompleted ? 'success.main' : 
                                   isActive ? 'primary.main' : 
                                   'grey.300',
                        cursor: isAIWizard ? 'help' : isDisabled ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        mx: 'auto',
                        mb: 1,
                        animation: isActive ? `${pulse} 2s infinite` : 'none',
                        '&:hover': {
                          ...(isActive ? {
                            transform: 'none',
                            borderColor: 'primary.main'
                          } : {
                            borderColor: isAIWizard ? 'primary.main' : 
                                       isDisabled ? 'grey.300' : 
                                       'primary.main',
                            transform: isAIWizard ? 'none' : isDisabled ? 'none' : 'scale(1.1)',
                            bgcolor: isAIWizard ? 'background.paper' : undefined
                          })
                        }
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon color={isCompleted ? "success" : "action"} />
                      ) : (
                        <RadioButtonUncheckedIcon color={isActive ? "primary" : "action"} />
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      align="center"
                      sx={{
                        color: 'text.primary',  // Keep text black
                        fontWeight: isActive ? 600 : 400,
                        mt: 1
                      }}
                    >
                      {section.title}
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>
            </Box>
          );
        })}
      </Slider>
      <CarouselCounter direction="right" count={hiddenRight} />
    </Box>
  );
};

export default SectionHeader; 