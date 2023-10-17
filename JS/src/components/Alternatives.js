const Alternatives = ({title, idx, disabled, clicked, href}) => {
    return (
        <div className="alternative-container">
            <button className="alternative-button" value={idx} disabled={disabled} onClick={clicked}>{idx}. {title}</button>
            {(()=>{
                if (href !== undefined)
                    return(
                        <a className="recipe-link" target="_blank" href={href}>リンク</a>
                    )
                else{
                    return (
                        <a className="recipe-link" target="_blank" tabIndex={-1}>リンク</a>
                    )
                }
            })()}
            
        </div>
    )
}

export default Alternatives