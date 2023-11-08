import AlternativeTableRow from "./AlternativeTableRow";

const AlternativeTable = ({alternatives, isSolving}) => {
    return (
        <div className='alternative-table'>
        
            {alternatives.map( (alternative, idx) =>{
                return <AlternativeTableRow key={idx} alternative={alternative} isSolving={isSolving}/>
            })}
                
        </div>
    )
}

export default AlternativeTable;