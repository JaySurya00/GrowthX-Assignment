const express= require('express');
const adminRouter= require('./routes/admin-routes.js');
const userRouter= require('./routes/user-routes.js');
const NotFoundError= require('./errors/not-found-error.js');
const errorHandler= require('./middlewares/error-handler.js');
const cookieSession = require('cookie-session');

const app = express();
app.use(express.json());
app.use(
    cookieSession({
      signed: false,
    })
  );

app.use('/api/users', userRouter);
app.use('/api/admins', adminRouter)
app.use('*', (req, res)=>{
    throw new NotFoundError();
})

app.use(errorHandler);

module.exports= app;