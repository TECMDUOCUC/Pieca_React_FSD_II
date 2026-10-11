

export default function RockCard({ item, isActive = false, onClick, onVisit }) {
  return (
    <div 
      className={`card h-100 ${isActive ? 'shadow-lg' : ''}`}
      style={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: isActive ? '#2a2a2a' : '#1a1a1a',
        transform: isActive ? 'scale(1)' : 'scale(0.9)',
        opacity: isActive ? 1 : 0.7
      }}
      onClick={onClick}
    >
      <img 
        src={item.imgdir} 
        className="card-img-top" 
        alt={item.name}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body text-center">
        <h5 className="card-title text-white">{item.name}</h5>
        {isActive && (
          <button 
            className="btn btn-light mt-2"
            onClick={(e) => {
              e.stopPropagation();
              onVisit();
            }}
          >
            Visitar
          </button>
        )}
      </div>
    </div>
  );
}