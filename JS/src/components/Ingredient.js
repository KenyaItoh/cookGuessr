const Ingredient = ({ingredient_name, quantity}) => {
    return (
        // <div>{ingredient_name + "   " + quantity}</div>
        <tr className="ingredient-container">
            <td className="ingredient">{ingredient_name}</td>
            <td className="quantity">{quantity}</td>
        </tr>
        
    )
}

export default Ingredient