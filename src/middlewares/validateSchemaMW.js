export default function validateSchema(schema) {
  return (req, res, next) => { 
    const validation = schema.validate(req.body);
    
    if (validation.error) {
      return res.status(422).send("Todos os campos precisam estar preenchidos!");
    }
    
    next();
  }
}