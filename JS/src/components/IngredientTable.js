import Table from 'react-bootstrap/Table';
import IngredientTableRow from "./IngredientTableRow";


const IngredientTable = ({ingredients}) => {
    return (
        <Table border={3} align='center' className='ingredient-table' striped bordered variant='info'>
          <thead>
            <tr>
              <th>材料</th>
              <th>分量</th>
            </tr>
          </thead>
          <tbody className='ingredient-table-body'>
            {ingredients.map((ingredient, idx) => {
                return <IngredientTableRow key={idx} ingredient={ingredient}/>
            })}
          </tbody>
        </Table>
    )
}

export default IngredientTable;