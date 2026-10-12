// src/components/Orchids.jsx
import { useMemo, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import useOrchids from '../hooks/useOrchids';
import CategoryFilter from './CategoryFilter';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import OrchidCard from './OrchidCard';
import OrchidDetailModal from './OrchidDetailModal';
import SearchBox from './SearchBox';

export default function Orchids() {
  const { orchids, loading, error, reload } = useOrchids();
  const [show, setShow] = useState(false);
  const [selectedOrchid, setSelectedOrchid] = useState(null);

  // Search & Filter state (Derived view - Layer C)
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('ALL');
  const [specialOnly, setSpecialOnly] = useState(false);

  const handleShow = (orchid) => {
    setSelectedOrchid(orchid);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedOrchid(null);
  };

  // Derive categories list dynamically with fallback default
  const categories = useMemo(() => {
    const defaultCats = ['ALL', 'Dendrobium', 'Cattleya', 'Phalaenopsis', 'Oncidium', 'Vanda'];
    if (!orchids || orchids.length === 0) return defaultCats;
    const set = new Set(orchids.map((o) => o.category));
    return ['ALL', ...Array.from(set)];
  }, [orchids]);

  // Derived filtered orchids
  const visibleOrchids = useMemo(() => {
    return orchids.filter((o) => {
      const matchName = o.orchidName.toLowerCase().includes(keyword.trim().toLowerCase());
      const matchCategory = category === 'ALL' || o.category === category;
      const matchSpecial = !specialOnly || Boolean(o.isSpecial);
      return matchName && matchCategory && matchSpecial;
    });
  }, [orchids, keyword, category, specialOnly]);

  return (
    <Container id="orchids" className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">Orchids List</h2>
        <Button variant="outline-primary" onClick={reload} disabled={loading}>
          {loading ? 'Đang tải...' : 'Reload (Bypass Cache)'}
        </Button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="filter-section shadow-sm">
        <Row className="g-3 align-items-center">
          <Col md={5}>
            <SearchBox keyword={keyword} onChange={setKeyword} />
          </Col>
          <Col md={7}>
            <CategoryFilter
              categories={categories}
              selectedCategory={category}
              onSelectCategory={setCategory}
              specialOnly={specialOnly}
              onToggleSpecial={setSpecialOnly}
            />
          </Col>
        </Row>
      </div>

      {/* Async States: Loading, Error, Empty, Data */}
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={reload} />}
      {!loading && !error && visibleOrchids.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted fs-5 mb-0">Không có Orchid nào phù hợp với điều kiện tìm kiếm.</p>
        </div>
      )}
      {!loading && !error && visibleOrchids.length > 0 && (
        <Row>
          {visibleOrchids.map((orchid) => (
            <Col xs={12} sm={6} lg={3} key={orchid.id} className="mb-4">
              <OrchidCard orchid={orchid} onDetail={handleShow} />
            </Col>
          ))}
        </Row>
      )}

      {/* Detail Modal */}
      <OrchidDetailModal show={show} orchid={selectedOrchid} onClose={handleClose} />
    </Container>
  );
}
