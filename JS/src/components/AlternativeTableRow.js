import Button from 'react-bootstrap/Button';

const AlternativeTableRow = ({alternative, isSolving = true }) => {
    const alt = alternative;
    return ( 
        <div className="alternative-container">
            <Button 
                className="alternative-button" 
                disabled={!isSolving}
                onClick={()=>alt.clicked(alt.idx)}
                variant='primary'
            >
                {alt.idx+1}. {alt.title} 
            </Button>
            {!isSolving &&
                <a className="recipe-link" target="_blank" href={alt.href}>
                    <img 
                        src='./cookpad.png' 
                        alt='Link' 
                        height={"32px"} 
                        style={{"opacity": alt.href!==undefined ? 1 : 0.5}}
                    />
                </a>}
        </div>
    )
}

export default AlternativeTableRow