-- Trigger to update favorites_count on cars table when favorites are added/removed

-- Function to update favorites_count
CREATE OR REPLACE FUNCTION update_car_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment favorites_count when a favorite is added
    UPDATE cars
    SET favorites_count = COALESCE(favorites_count, 0) + 1
    WHERE id = NEW.car_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement favorites_count when a favorite is removed
    UPDATE cars
    SET favorites_count = GREATEST(COALESCE(favorites_count, 0) - 1, 0)
    WHERE id = OLD.car_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT
CREATE TRIGGER trigger_update_favorites_count_insert
  AFTER INSERT ON user_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_car_favorites_count();

-- Trigger for DELETE
CREATE TRIGGER trigger_update_favorites_count_delete
  AFTER DELETE ON user_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_car_favorites_count();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION update_car_favorites_count() TO authenticated;
GRANT EXECUTE ON FUNCTION update_car_favorites_count() TO anon;



