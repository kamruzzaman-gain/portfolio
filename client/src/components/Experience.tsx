import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Experience } from "@shared/schema";

export function Experience() {
  const { data: experiences, isLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences"],
  });

  if (isLoading) {
    return <div className="py-20 bg-muted/30">Loading...</div>;
  }

  return (
    <section id="experience" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Work Experience</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My professional journey and the companies I've had the privilege to work with.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden sm:block"></div>

            {experiences?.map((experience, index) => (
              <motion.div
                key={experience.id}
                className="relative flex items-start mb-12"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0 w-16 h-16 bg-background rounded-full border-4 border-primary shadow-lg flex items-center justify-center z-10">
                  {experience.companyLogo ? (
                    <img 
                      src={experience.companyLogo} 
                      alt={`${experience.company} Logo`} 
                      className="w-8 h-8 rounded"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">
                        {experience.company.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="ml-6 bg-background dark:bg-slate-800 rounded-xl shadow-lg p-6 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{experience.role}</h3>
                      <p className="text-primary font-semibold">{experience.company}</p>
                    </div>
                    <Badge variant="secondary" className="mt-2 sm:mt-0 w-fit">
                      {experience.duration}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {experience.description}
                  </p>
                  
                  {experience.technologies && experience.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
