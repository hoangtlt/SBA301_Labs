// src/components/SearchBox.jsx
import { Form } from 'react-bootstrap';

export default function SearchBox({ keyword, onChange }) {
  return (
    <Form.Group className="mb-0">
      <Form.Label visuallyHidden>Search Orchids</Form.Label>
      <Form.Control
        type="search"
        placeholder="Tìm kiếm theo tên hoa lan..."
        value={keyword}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search orchids"
      />
    </Form.Group>
  );
}
