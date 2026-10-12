// src/components/CategoryFilter.jsx
import { Form } from 'react-bootstrap';

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  specialOnly,
  onToggleSpecial
}) {
  return (
    <div className="d-flex flex-wrap align-items-center gap-3">
      <div className="d-flex align-items-center gap-2">
        <Form.Label htmlFor="category-select" className="mb-0 text-nowrap fw-semibold">
          Category:
        </Form.Label>
        <Form.Select
          id="category-select"
          size="sm"
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
          aria-label="Filter by Category"
          style={{ minWidth: '150px' }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'ALL' ? 'Tất cả danh mục' : cat}
            </option>
          ))}
        </Form.Select>
      </div>

      <Form.Check
        type="switch"
        id="special-only-switch"
        label="Chỉ hoa đặc biệt (Special)"
        checked={specialOnly}
        onChange={(e) => onToggleSpecial(e.target.checked)}
        className="mb-0 fw-semibold"
      />
    </div>
  );
}
