export function loggerMiddleware(req, res, next) {

  const time = new Date().toISOString();

  const idPart = req.params.id
    ? `| ID: ${req.params.id}`
    : "";

  console.log(
    `[${time}] ${req.method} ${req.originalUrl} ${idPart}`
  );

  next();
}