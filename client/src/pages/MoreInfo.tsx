
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Play, Star, Calendar, Clock } from 'lucide-react';

const MoreInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const content = location.state || {};

  // Debug content data
  console.log('MoreInfo content:', content);
  console.log('MoreInfo image/thumbnail:', content?.image || content?.thumbnail_url);

  const handlePlayClick = () => {
    navigate('/player', {
      state: content
    });
  };

  const getSeasonsOrEpisodes = () => {
    if (content.type === 'movie' || content.content_type === 'Movie') {
      const duration = content.duration || content.movie?.duration || content.movie_data?.duration;
      return duration ? `${duration} min` : null;
    } else if (content.type === 'series' || content.content_type === 'Web Series') {
      const seasonNum = content.seasonNumber || 1;
      return `Season ${seasonNum}`;
    } else if (content.type === 'Show' || content.content_type === 'Show') {
      // For Shows, get episode count from show_data
      const episodeCount = content.show_data?.episode_id_list?.length || 0;
      return episodeCount > 0 ? `${episodeCount} Episode${episodeCount > 1 ? 's' : ''}` : null;
    }
    return null;
  };

  const getEpisodeCount = () => {
    if (content.type === 'series' || content.content_type === 'Web Series') {
      // Get episode count from web series season data
      const episodeCount = content.web_series?.seasons?.[0]?.episode_id_list?.length || 
                          content.web_series_data?.seasons?.[0]?.episode_id_list?.length ||
                          content.web_series?.seasons?.[0]?.episodes?.length ||
                          content.seasons?.[0]?.episode_id_list?.length ||
                          content.seasons?.[0]?.episodes?.length ||
                          content.episodes || 
                          0;
      return episodeCount > 0 ? `${episodeCount} Episode${episodeCount > 1 ? 's' : ''}` : null;
    } else if (content.type === 'Show' || content.content_type === 'Show') {
      // For Shows, get episode count from show_data
      const episodeCount = content.show_data?.episode_id_list?.length || 0;
      return episodeCount > 0 ? `${episodeCount} Episode${episodeCount > 1 ? 's' : ''}` : null;
    }
    return null;
  };

  const getDirectors = () => {
    if (content.content_type === 'Movie' || content.type === 'movie') {
      return content.directors || content.director || 
             content.movie?.director ||
             content.movie_data?.director;
    } else if (content.content_type === 'Web Series' || content.type === 'series') {
      return content.directors || content.director || 
             content.web_series?.seasons?.[0]?.director || 
             content.web_series_data?.seasons?.[0]?.director ||
             content.seasons?.[0]?.director;
    } else if (content.content_type === 'Show' || content.type === 'Show') {
      // Access show data like upcoming_content
      return content.show_data?.directors || content.directors;
    }
    return null;
  };

  const getWriters = () => {
    if (content.content_type === 'Movie' || content.type === 'movie') {
      return content.writers || content.writer || 
             content.movie?.writer ||
             content.movie_data?.writer;
    } else if (content.content_type === 'Web Series' || content.type === 'series') {
      return content.writers || content.writer || 
             content.web_series?.seasons?.[0]?.writer || 
             content.web_series_data?.seasons?.[0]?.writer ||
             content.seasons?.[0]?.writer;
    } else if (content.content_type === 'Show' || content.type === 'Show') {
      // Access show data like upcoming_content
      return content.show_data?.writers || content.writers;
    }
    return null;
  };

  const getCastMembers = () => {
    if (content.content_type === 'Movie' || content.type === 'movie') {
      return content.cast || content.cast_members || 
             content.movie?.cast_members ||
             content.movie_data?.cast_members;
    } else if (content.content_type === 'Web Series' || content.type === 'series') {
      return content.cast || content.cast_members || 
             content.web_series?.seasons?.[0]?.cast_members || 
             content.web_series_data?.seasons?.[0]?.cast_members ||
             content.seasons?.[0]?.cast_members;
    } else if (content.content_type === 'Show' || content.type === 'Show') {
      // Access show data like upcoming_content
      return content.show_data?.cast_members || content.cast_members;
    }
    return null;
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button onClick={() => navigate(-1)} variant="outline" size="sm" className="bg-primary/5 backdrop-blur-sm border border-primary/30 text-primary hover:bg-gradient-to-br hover:from-black/30 hover:via-dark-green/5 hover:to-black/30 hover:border-primary/20 transition-all duration-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <Card className="bg-gradient-to-br from-black/90 via-dark-green/20 to-black/90 backdrop-blur-sm border border-border/50 wave-transition relative overflow-hidden">
            {/* Animated Background Waves */}
            <div className="absolute inset-0">
              <div className="upcoming-wave-bg-1"></div>
              <div className="upcoming-wave-bg-2"></div>
              <div className="upcoming-wave-bg-3"></div>
            </div>

            <CardHeader className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="w-full aspect-[16/9] relative overflow-hidden rounded-lg">
                    <img 
                      src={content.thumbnail_url || content.image || '/placeholder.svg'} 
                      alt={content.title} 
                      className="w-full h-full object-cover object-center" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== '/placeholder.svg') {
                          target.src = '/placeholder.svg';
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6 min-w-0">
                  <h1 className="text-xl font-bold text-foreground">
                    {content.title}
                  </h1>

                  <div className="flex items-center space-x-3 flex-wrap">
                    {(content.rating || content.rating_type) && (
                      <span className="bg-primary/20 text-primary px-2 py-1 rounded border border-primary/30 text-xs font-medium">
                        {content.rating || content.rating_type}
                      </span>
                    )}
                    {(content.type || content.content_type) && (
                      <span className="bg-blue-900/25 text-blue-200 px-2 py-1 rounded border border-blue-800/40 text-xs font-medium">
                        {content.type || content.content_type}
                      </span>
                    )}
                    {(() => {
                      const year = content.year || 
                                 content.movie?.release_year ||
                                 content.movie_data?.release_year ||
                                 content.web_series?.seasons?.[0]?.release_year ||
                                 content.web_series_data?.seasons?.[0]?.release_year ||
                                 content.show_data?.release_year;
                      
                      if (!year) return null;
                      
                      return (
                        <div className="flex items-center space-x-2 bg-emerald-800/20 px-2 py-1 rounded-md border border-emerald-700/30">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-100 font-medium text-xs">
                            {year}
                          </span>
                        </div>
                      );
                    })()}
                    {(() => {
                      const score = content.score || 
                                  content.rating ||
                                  content.movie?.rating ||
                                  content.movie_data?.rating ||
                                  content.web_series?.seasons?.[0]?.rating ||
                                  content.web_series_data?.seasons?.[0]?.rating ||
                                  content.show_data?.rating;
                      
                      if (!score) return null;
                      
                      return (
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-foreground font-medium text-xs">{score}</span>
                        </div>
                      );
                    })()}
                    {getSeasonsOrEpisodes() && (
                      <div className="flex items-center space-x-2 bg-violet-800/20 px-2 py-1 rounded-md border border-violet-700/30">
                        <Clock className="w-3 h-3 text-violet-400" />
                        <span className="text-violet-100 font-medium text-xs highlight-glow">
                          {getSeasonsOrEpisodes()}
                        </span>
                      </div>
                    )}
                    {getEpisodeCount() && (content.content_type === 'Web Series' || content.content_type === 'Show') && (
                      <div className="flex items-center space-x-2 bg-amber-800/20 px-2 py-1 rounded-md border border-amber-700/30">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span className="text-amber-100 font-medium text-xs">
                          {getEpisodeCount()}
                        </span>
                      </div>
                    )}
                  </div>

                  {(() => {
                    const description = content.description || 
                                      content.web_series?.seasons?.[0]?.season_description ||
                                      content.web_series_data?.seasons?.[0]?.season_description ||
                                      content.show_data?.description ||
                                      content.movie?.description ||
                                      content.movie_data?.description;
                    
                    if (!description) return null;
                    
                    return (
                      <div className="mt-4">
                        <p className="text-foreground/90 leading-relaxed text-sm font-normal whitespace-pre-line break-words">
                          {description}
                        </p>
                      </div>
                    );
                  })()}

                  <div className="flex justify-start gap-3 mt-6">
                    <Button onClick={handlePlayClick} className="bg-primary/10 backdrop-blur-sm border border-primary/50 text-primary hover:bg-gradient-to-br hover:from-black/60 hover:via-dark-green/10 hover:to-black/60 hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-xs">
                      <Play className="h-3 w-3 mr-1" />
                      Play
                    </Button>
                    <Button onClick={() => console.log('Play trailer for:', content.title)} className="bg-primary/10 backdrop-blur-sm border border-primary/50 text-primary hover:bg-gradient-to-br hover:from-black/60 hover:via-dark-green/10 hover:to-black/60 hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-xs">
                      <Play className="h-3 w-3 mr-1" />
                      Trailer
                    </Button>
                  </div>

                  {/* Additional Content Details */}
                  <div className="space-y-4 border-t border-border/30 pt-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Additional Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {content.genre && content.genre.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">Genres</h3>
                          <div className="flex flex-wrap gap-2">
                            {(Array.isArray(content.genre) ? content.genre : [content.genre]).map((g, index) => (
                              <span key={index} className="bg-purple-800/20 text-purple-300 px-2 py-1 rounded border border-purple-700/30 text-xs">
                                {g}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {(() => {
                        const duration = content.duration || 
                                       content.movie?.duration ||
                                       content.movie_data?.duration;
                        
                        if (!duration || (content.content_type === 'Web Series' || content.content_type === 'Show')) return null;
                        
                        return (
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Duration</h3>
                            <span className="bg-indigo-800/20 text-indigo-300 px-2 py-1 rounded border border-indigo-700/30 text-xs">
                              {duration} minutes
                            </span>
                          </div>
                        );
                      })()}

                      {(content.content_type === 'Web Series' || content.content_type === 'Show') && getEpisodeCount() && (
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">Episodes</h3>
                          <span className="bg-blue-800/20 text-blue-300 px-2 py-1 rounded border border-blue-700/30 text-xs">
                            {getEpisodeCount()}
                          </span>
                        </div>
                      )}

                      {content.content_type === 'Web Series' && content.seasonNumber && (
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">Season</h3>
                          <span className="bg-green-800/20 text-green-300 px-2 py-1 rounded border border-green-700/30 text-xs">
                            Season {content.seasonNumber}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Directors */}
                    {(() => {
                      const directors = getDirectors();
                      
                      if (!directors || (Array.isArray(directors) && directors.length === 0)) return null;
                      
                      const directorsList = Array.isArray(directors) ? directors : 
                                          (typeof directors === 'string' ? directors.split(',') : [directors]);
                      
                      return (
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">Directors</h3>
                          <div className="flex flex-wrap gap-2">
                            {directorsList.map((director, index) => (
                              <span key={index} className="bg-orange-800/20 text-orange-300 px-2 py-1 rounded border border-orange-700/30 text-xs">
                                {typeof director === 'string' ? director.trim() : director}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Writers */}
                    {(() => {
                      const writers = getWriters();
                      
                      if (!writers || (Array.isArray(writers) && writers.length === 0)) return null;
                      
                      const writersList = Array.isArray(writers) ? writers : 
                                        (typeof writers === 'string' ? writers.split(',') : [writers]);
                      
                      return (
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">Writers</h3>
                          <div className="flex flex-wrap gap-2">
                            {writersList.map((writer, index) => (
                              <span key={index} className="bg-teal-800/20 text-teal-300 px-2 py-1 rounded border border-teal-700/30 text-xs">
                                {typeof writer === 'string' ? writer.trim() : writer}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Cast Members */}
                    {(() => {
                      const cast = getCastMembers();
                      
                      if (!cast || (Array.isArray(cast) && cast.length === 0)) return null;
                      
                      const castList = Array.isArray(cast) ? cast : 
                                     (typeof cast === 'string' ? cast.split(',') : [cast]);
                      
                      return (
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">Cast Members</h3>
                          <div className="flex flex-wrap gap-2">
                            {castList.map((castMember, index) => (
                              <span key={index} className="bg-pink-800/20 text-pink-300 px-2 py-1 rounded border border-pink-700/30 text-xs">
                                {typeof castMember === 'string' ? castMember.trim() : castMember}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MoreInfo;
