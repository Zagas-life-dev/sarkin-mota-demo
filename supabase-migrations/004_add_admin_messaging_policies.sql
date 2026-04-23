-- Add admin policies for messaging system
-- This allows admins to view and manage all conversations and messages

-- Admin policies for conversations
CREATE POLICY "Admins can view all conversations"
  ON conversations FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can insert conversations"
  ON conversations FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update all conversations"
  ON conversations FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete conversations"
  ON conversations FOR DELETE
  USING (is_admin());

-- Admin policies for messages
CREATE POLICY "Admins can view all messages"
  ON messages FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can insert messages"
  ON messages FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update all messages"
  ON messages FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

