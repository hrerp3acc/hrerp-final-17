
-- Add foreign key constraints for performance_goals table
ALTER TABLE performance_goals 
ADD CONSTRAINT performance_goals_employee_id_fkey 
FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE;

-- Add foreign key constraints for performance_reviews table  
ALTER TABLE performance_reviews 
ADD CONSTRAINT performance_reviews_employee_id_fkey 
FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE;

ALTER TABLE performance_reviews 
ADD CONSTRAINT performance_reviews_reviewer_id_fkey 
FOREIGN KEY (reviewer_id) REFERENCES employees(id) ON DELETE SET NULL;
