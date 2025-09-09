'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import { ChevronDownIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import configData from '@/config/data.json';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['all']);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('proof-of-work');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [carouselStates, setCarouselStates] = useState<{[key: number]: {currentIndex: number, isVideo: boolean}}>({});
  const [carouselControlsVisible, setCarouselControlsVisible] = useState<{[key: number]: boolean}>({});
  const [showDesktopWarning, setShowDesktopWarning] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);
  const [fullscreenMedia, setFullscreenMedia] = useState<{type: 'video' | 'photo', src: string, projectIndex: number, currentIndex: number} | null>(null);
  const projectsPerPage = configData.settings.projectsPerPage;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<{[key: number]: NodeJS.Timeout}>({});

  const projects = configData.tabs['proof-of-work'].projects;

  const allTags = ['all', ...Array.from(new Set(projects.flatMap(p => p.tags)))];

  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  const handleLiveLinkClick = (e: React.MouseEvent, project: any) => {
    if (project.desktopOnly && isMobile()) {
      e.preventDefault();
      setPendingLink(project.liveLink);
      setShowDesktopWarning(true);
    }
  };

  const handleMediaClick = (type: 'video' | 'photo', src: string, projectIndex: number, currentIndex: number) => {
    setFullscreenMedia({ type, src, projectIndex, currentIndex });
  };

  const closeFullscreen = () => {
    setFullscreenMedia(null);
  };

  const navigateFullscreenMedia = (direction: 'prev' | 'next') => {
    if (!fullscreenMedia) return;
    
    const project = projects[fullscreenMedia.projectIndex];
    const hasVideo = project.video && project.video.trim() !== '';
    const totalItems = (hasVideo ? 1 : 0) + (project.photos?.length || 0);
    
    let newType = fullscreenMedia.type;
    let newIndex = fullscreenMedia.currentIndex;
    let newSrc = fullscreenMedia.src;
    
    if (direction === 'next') {
      if (fullscreenMedia.type === 'video') {
        // From video, go to first photo
        if (project.photos && project.photos.length > 0) {
          newType = 'photo';
          newIndex = 0;
          newSrc = project.photos[0];
        }
      } else {
        // From photo, go to next photo or video
        if (newIndex + 1 < (project.photos?.length || 0)) {
          newIndex = newIndex + 1;
          newSrc = project.photos[newIndex];
        } else if (hasVideo) {
          newType = 'video';
          newIndex = 0;
          newSrc = project.video;
        }
      }
    } else {
      if (fullscreenMedia.type === 'video') {
        // From video, go to last photo
        if (project.photos && project.photos.length > 0) {
          newType = 'photo';
          newIndex = project.photos.length - 1;
          newSrc = project.photos[newIndex];
        }
      } else {
        // From photo, go to previous photo or video
        if (newIndex > 0) {
          newIndex = newIndex - 1;
          newSrc = project.photos[newIndex];
        } else if (hasVideo) {
          newType = 'video';
          newIndex = 0;
          newSrc = project.video;
        }
      }
    }
    
    setFullscreenMedia({ type: newType, src: newSrc, projectIndex: fullscreenMedia.projectIndex, currentIndex: newIndex });
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTag = selectedTags.includes('all') || selectedTags.some(tag => project.tags.includes(tag));
      
      return matchesSearch && matchesTag;
    });
  }, [searchTerm, selectedTags]);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + projectsPerPage);

  const coolThings = configData.tabs['cool-things'].items;

  const experience = configData.tabs.experience.items;

  const wins = configData.tabs.wins.items;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTagToggle = (tag: string) => {
    if (tag === 'all') {
      setSelectedTags(['all']);
    } else {
      setSelectedTags(prev => {
        const newTags = prev.filter(t => t !== 'all');
        if (newTags.includes(tag)) {
          const filtered = newTags.filter(t => t !== tag);
          return filtered.length === 0 ? ['all'] : filtered;
        } else {
          return [...newTags, tag];
        }
      });
    }
    setCurrentPage(1);
  };

  const getCarouselState = (projectIndex: number) => {
    return carouselStates[projectIndex] || { currentIndex: 0, isVideo: false };
  };

  const updateCarouselState = (projectIndex: number, updates: Partial<{currentIndex: number, isVideo: boolean}>) => {
    setCarouselStates(prev => ({
      ...prev,
      [projectIndex]: {
        ...getCarouselState(projectIndex),
        ...updates
      }
    }));
  };

  const showCarouselControls = (projectIndex: number) => {
    setCarouselControlsVisible(prev => ({
      ...prev,
      [projectIndex]: true
    }));
    
    // Clear existing timeout
    if (hideTimeoutRef.current[projectIndex]) {
      clearTimeout(hideTimeoutRef.current[projectIndex]);
    }
    
    // Set new timeout to hide controls after 3 seconds
    hideTimeoutRef.current[projectIndex] = setTimeout(() => {
      setCarouselControlsVisible(prev => ({
        ...prev,
        [projectIndex]: false
      }));
    }, 3000);
  };

  const hideCarouselControls = (projectIndex: number) => {
    if (hideTimeoutRef.current[projectIndex]) {
      clearTimeout(hideTimeoutRef.current[projectIndex]);
    }
    setCarouselControlsVisible(prev => ({
      ...prev,
      [projectIndex]: false
    }));
  };

  const nextCarouselItem = (projectIndex: number, project: any) => {
    const state = getCarouselState(projectIndex);
    const hasVideo = project.video && project.video.trim() !== '';
    const totalPhotos = project.photos?.length || 0;
    
    if (hasVideo && state.isVideo) {
      // Switch to first photo
      updateCarouselState(projectIndex, { isVideo: false, currentIndex: 0 });
    } else {
      // Move to next photo or back to video
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= totalPhotos) {
        if (hasVideo) {
          updateCarouselState(projectIndex, { isVideo: true, currentIndex: 0 });
        } else {
          updateCarouselState(projectIndex, { currentIndex: 0 }); // Loop back to first photo
        }
      } else {
        updateCarouselState(projectIndex, { currentIndex: nextIndex });
      }
    }
    showCarouselControls(projectIndex);
  };

  const prevCarouselItem = (projectIndex: number, project: any) => {
    const state = getCarouselState(projectIndex);
    const hasVideo = project.video && project.video.trim() !== '';
    const totalPhotos = project.photos?.length || 0;
    
    if (hasVideo && state.isVideo) {
      // Switch to last photo
      const lastPhotoIndex = totalPhotos - 1;
      updateCarouselState(projectIndex, { isVideo: false, currentIndex: lastPhotoIndex });
    } else {
      // Move to previous photo or back to video
      if (state.currentIndex === 0) {
        if (hasVideo) {
          updateCarouselState(projectIndex, { isVideo: true, currentIndex: 0 });
        } else {
          updateCarouselState(projectIndex, { currentIndex: totalPhotos - 1 }); // Loop to last photo
        }
      } else {
        updateCarouselState(projectIndex, { currentIndex: state.currentIndex - 1 });
      }
    }
    showCarouselControls(projectIndex);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);


  return (
    <div className="container">
      <div className="header">
        <div className="intro">
          <div className="intro-content">
            <h1>{configData.profile.name}</h1>
            {configData.profile.bio.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
            <div className="links mt-[10px]">
              <a href={configData.profile.socials.twitter} target="_blank" rel="noopener noreferrer">twitter</a>
              <span className="separator">.</span>
              <a href={configData.profile.socials.github} target="_blank" rel="noopener noreferrer">github</a>
            </div>
          </div>
          <div className="profile-pic">
            <img 
              src={configData.profile.image} 
              alt="Preyanshu" 
              className="profile-image"
            />
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'proof-of-work' ? 'active' : ''}`}
          onClick={() => setActiveTab('proof-of-work')}
        >
          {configData.tabs['proof-of-work'].title}
        </button>
        <button
          className={`tab ${activeTab === 'cool-things' ? 'active' : ''}`}
          onClick={() => setActiveTab('cool-things')}
        >
          {configData.tabs['cool-things'].title}
        </button>
        <button
          className={`tab ${activeTab === 'experience' ? 'active' : ''}`}
          onClick={() => setActiveTab('experience')}
        >
          {configData.tabs.experience.title}
        </button>
        <button
          className={`tab ${activeTab === 'wins' ? 'active' : ''}`}
          onClick={() => setActiveTab('wins')}
        >
          {configData.tabs.wins.title}
        </button>
        <button
          className={`tab ${activeTab === 'testimonials' ? 'active' : ''}`}
          onClick={() => setActiveTab('testimonials')}
        >
          {configData.tabs.testimonials.title}
        </button>
      </div>

      {activeTab === 'proof-of-work' && (
        <>
          <div className="controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="search projects..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>
        
                       <div className="filter-container">
                 <div className="filter-dropdown" ref={dropdownRef}>
                   <div 
                     className="filter-trigger" 
                     onClick={() => setIsFilterOpen(!isFilterOpen)}
                   >
                     <span className="filter-text">filter by category</span>
                     <span className="filter-text-mobile">filter</span>
                     <ChevronDownIcon className="filter-icon" />
                   </div>
                   {isFilterOpen && (
                     <div className="filter-content">
                       {allTags.map(tag => (
                         <div key={tag} className="filter-item" onClick={() => handleTagToggle(tag)}>
                           <Checkbox.Root
                             checked={selectedTags.includes(tag)}
                             className="filter-checkbox"
                           >
                             <Checkbox.Indicator className="filter-checkbox-indicator">
                               <CheckIcon />
                             </Checkbox.Indicator>
                           </Checkbox.Root>
                           <span className="filter-item-text">
                             {tag === 'all' ? 'all projects' : tag}
                           </span>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
      </div>
      
              <main>
          {paginatedProjects.map((project, index) => {
            const carouselState = getCarouselState(index);
            const hasVideo = project.video && project.video.trim() !== '';
            const totalItems = (hasVideo ? 1 : 0) + (project.photos?.length || 0);
            
            return (
              <div key={index} className="project-item">
                <div className="project-title">{project.title}</div>
                <div className="project-links">
                  {project.link && (
                    <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
                      {project.link}
                    </a>
                  )}
                  {project.liveLink && (
                    <a 
                      href={project.liveLink} 
                      className="project-link live-link" 
          target="_blank"
          rel="noopener noreferrer"
                      onClick={(e) => handleLiveLinkClick(e, project)}
                    >
                      {project.liveLink}
                    </a>
                  )}
                </div>
                <div className="project-description">
                  {project.description}
                </div>
                <div className="project-tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                
                <div 
                  className="carousel-container"
                  onMouseEnter={() => showCarouselControls(index)}
                  onMouseLeave={() => hideCarouselControls(index)}
                >
                  <div className="carousel-content">
                    {hasVideo && carouselState.isVideo ? (
                      <div className="video-container" onClick={() => handleMediaClick('video', project.video, index, 0)}>
                        <video controls width="100%" height="300">
                          <source src={project.video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <div className="photo-container" onClick={() => handleMediaClick('photo', project.photos[carouselState.currentIndex], index, carouselState.currentIndex)}>
                        <img 
                          src={project.photos[carouselState.currentIndex]} 
                          alt={`${project.title} - Image ${carouselState.currentIndex + 1}`}
                          className="project-photo"
                        />
                      </div>
                    )}
                  </div>
                  
                  {totalItems > 1 && (
                    <div className={`carousel-controls ${carouselControlsVisible[index] ? 'visible' : 'hidden'}`}>
                      <button 
                        className="carousel-btn carousel-btn-prev"
                        onClick={() => prevCarouselItem(index, project)}
                      >
                        <ChevronLeftIcon />
                      </button>
                      <button 
                        className="carousel-btn carousel-btn-next"
                        onClick={() => nextCarouselItem(index, project)}
                      >
                        <ChevronRightIcon />
                      </button>
                      
                      <div className="carousel-indicators">
                        {hasVideo && (
                          <button 
                            className={`carousel-indicator ${carouselState.isVideo ? 'active' : ''}`}
                            onClick={() => {
                              updateCarouselState(index, { isVideo: true, currentIndex: 0 });
                              showCarouselControls(index);
                            }}
                          >
                            Video
                          </button>
                        )}
                        {project.photos?.map((_, photoIndex) => (
                          <button 
                            key={photoIndex}
                            className={`carousel-indicator ${!carouselState.isVideo && carouselState.currentIndex === photoIndex ? 'active' : ''}`}
                            onClick={() => {
                              updateCarouselState(index, { isVideo: false, currentIndex: photoIndex });
                              showCarouselControls(index);
                            }}
                          >
                            {photoIndex + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </main>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            prev
          </button>
          
          <div className="pagination-info">
            {currentPage} / {totalPages}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            next
          </button>
        </div>
      )}
        </>
      )}

      {activeTab === 'cool-things' && (
        <main>
          {coolThings.map((item, index) => (
            <div key={index} className="cool-item">
              <div className="cool-title">{item.title}</div>
              <a href={item.link} className="cool-link" target="_blank" rel="noopener noreferrer">
                read post →
              </a>
              <div className="cool-date">{item.date}</div>
              <div className="cool-description">
                {item.description}
              </div>
            </div>
          ))}
        </main>
      )}

      {activeTab === 'experience' && (
        <main>
          {experience.map((job, index) => (
            <div key={index} className="experience-item">
              <div className="experience-content">
                <div className="experience-logo">
                  <img src={job.logo} alt={`${job.company} logo`} />
                </div>
                <div className="experience-details">
                  <div className="experience-header">
                    <div className="experience-title">{job.title}</div>
                    <div className="experience-company">{job.company}</div>
                    <div className="experience-period">{job.period}</div>
                  </div>
                  <div className="experience-description">
                    {job.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </main>
      )}

      {activeTab === 'wins' && (
        <main>
          {wins.map((win, index) => (
            <div key={index} className="win-item">
              <div className="win-content">
                <div className="win-logo">
                  <img src={win.logo} alt={`${win.event} logo`} />
                </div>
                <div className="win-details">
                  <div className="win-header">
                    <div className="win-title">{win.title}</div>
                    <div className="win-event">
                      {win.link ? (
                        <a href={win.link} target="_blank" rel="noopener noreferrer" className="win-link">
                          {win.event}
                        </a>
                      ) : (
                        win.event
                      )}
                    </div>
                    <div className="win-date">{win.date}</div>
                    {win.note && (
                      <div className="win-note">{win.note}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </main>
      )}

      {activeTab === 'testimonials' && (
        <main>
          {configData.tabs.testimonials.items.map((testimonial, index) => {
            // Check if this is the first message from this person
            const isFirstMessage = index === 0 || 
              configData.tabs.testimonials.items[index - 1].name !== testimonial.name;
            
            // Check if this is the last message from this person
            const isLastMessage = index === configData.tabs.testimonials.items.length - 1 ||
              configData.tabs.testimonials.items[index + 1].name !== testimonial.name;
            
            return (
              <div key={index} className={`testimonial-item ${isFirstMessage ? 'first-message' : ''} ${isLastMessage ? 'last-message' : ''}`}>
                <div className="testimonial-content">
                  {isFirstMessage && (
                    <div className="testimonial-avatar">
                      <img src={testimonial.avatar} alt={testimonial.name} />
                    </div>
                  )}
                  {!isFirstMessage && <div className="testimonial-avatar-spacer"></div>}
                  <div className="testimonial-bubble">
                    {isFirstMessage && (
                      <div className="testimonial-header">
                        <div className="testimonial-name">{testimonial.name}</div>
                        <div className="testimonial-position">{testimonial.position}</div>
                      </div>
                    )}
                    <div className="testimonial-message">{testimonial.message}</div>
                    <div className="testimonial-date">{testimonial.date}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </main>
      )}

      {/* Desktop Only Warning Modal */}
      {showDesktopWarning && (
        <div className="warning-overlay" onClick={() => setShowDesktopWarning(false)}>
          <div className="warning-modal" onClick={(e) => e.stopPropagation()}>
            <div className="warning-title">desktop only</div>
            <div className="warning-message">
              the intended use of this is only for desktop and it may not be optimized for mobile.
            </div>
            <div className="warning-buttons">
              <button 
                className="warning-button warning-button-cancel" 
                onClick={() => {
                  setShowDesktopWarning(false);
                  setPendingLink(null);
                }}
              >
                cancel
              </button>
              <button 
                className="warning-button warning-button-continue" 
                onClick={() => {
                  setShowDesktopWarning(false);
                  if (pendingLink) {
                    window.open(pendingLink, '_blank');
                    setPendingLink(null);
                  }
                }}
              >
                continue to site
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Media Modal */}
      {fullscreenMedia && (() => {
        const project = projects[fullscreenMedia.projectIndex];
        const hasVideo = project.video && project.video.trim() !== '';
        const totalItems = (hasVideo ? 1 : 0) + (project.photos?.length || 0);
        const canNavigate = totalItems > 1;
        
        return (
          <div className="fullscreen-overlay" onClick={closeFullscreen}>
            <button className="fullscreen-close" onClick={closeFullscreen}>
              ×
            </button>
            
            {canNavigate && (
              <>
                <button 
                  className="fullscreen-nav fullscreen-nav-prev" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateFullscreenMedia('prev');
                  }}
                >
                  <ChevronLeftIcon />
                </button>
                <button 
                  className="fullscreen-nav fullscreen-nav-next" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateFullscreenMedia('next');
                  }}
                >
                  <ChevronRightIcon />
                </button>
              </>
            )}
            
            <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
              {fullscreenMedia.type === 'video' ? (
                <video 
                  controls 
                  autoPlay 
                  className="fullscreen-media"
                  src={fullscreenMedia.src}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img 
                  src={fullscreenMedia.src} 
                  alt="Fullscreen view"
                  className="fullscreen-media"
                />
              )}
            </div>
            
            {canNavigate && (
              <div className="fullscreen-indicators">
                {hasVideo && (
                  <button
                    className={`fullscreen-indicator ${fullscreenMedia.type === 'video' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenMedia({
                        type: 'video',
                        src: project.video,
                        projectIndex: fullscreenMedia.projectIndex,
                        currentIndex: 0
                      });
                    }}
                  >
                    Video
                  </button>
                )}
                {project.photos?.map((_, photoIndex) => (
                  <button
                    key={photoIndex}
                    className={`fullscreen-indicator ${fullscreenMedia.type === 'photo' && fullscreenMedia.currentIndex === photoIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenMedia({
                        type: 'photo',
                        src: project.photos[photoIndex],
                        projectIndex: fullscreenMedia.projectIndex,
                        currentIndex: photoIndex
                      });
                    }}
                  >
                    {photoIndex + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
