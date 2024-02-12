import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function GalleryPage() {

  return (
    <>
      <h1>this is Gallery page</h1>
      <div>filter by:</div>
        <ul>
            <li>hot</li>
            <li>popular</li>
            <li>newest</li>
        </ul>
        <Row xs={6} className="g-4">
      {Array.from({ length: 8 }).map((_, idx) => (
        <Col key={idx}>
          <Card>
            <Card.Img variant="top" src="doodal.PNG" className='tmp'/>
            <Card.Body id="card">
               <div>user</div>
              <button id="like">&#9825;</button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
    </>
  );
}

export default GalleryPage;
