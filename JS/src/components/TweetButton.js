const TweetButton = ({instruction, url}) => {
    console.log(instruction);
    const tweetTextContent = `
    CookGuessrをプレイ中！
    ↓↓結果↓↓
    ${instruction}
        `;
    const tweetHashTags = "CookGuessr";
    return (
        <div style={{textAlign:"right", margin:"10px"}}>
            <a 
                href={`https://twitter.com/intent/tweet?hashtags=${tweetHashTags}&text=${tweetTextContent}&url=${url}`}
                className="twitter-share-button" 
                data-show-count="false"
                target='_blank'
            >
                <img 
                    src='./tweetbutton.png' 
                    alt='TweetButton' 
                    height={"24px"} 
                />
            </a>
            <script async src="https://platform.twitter.com/widgets.js"></script>
        </div>
    )
}

export default TweetButton;