const IngredientTableRow = ({ingredient}) => {
    return (
        <tr className="ingredient-container">
            <td className="ingredient">{ingredient.name}</td>
            <td className="quantity">{ingredient.quantity}</td>
        </tr>
    )
}

export default IngredientTableRow;