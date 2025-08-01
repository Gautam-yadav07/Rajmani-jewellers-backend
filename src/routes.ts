import app from "./config/server-config";
import userRoutes from "./users/routes/user-routes";
import adminRoutes from "./admin/routes/admin-routes";
import jewelleryRoutes from "./admin/routes/jewellery-routes";
import goldPriceRoutes from "./admin/routes/gold-price-routes";
import planRoutes from "./users/routes/saving-plan-routes"
import { auth } from "./middlewares/auth";
import { isAdmin } from "./middlewares/isAdmin";
import giftRoute from "./users/routes/gifted-gold-routes"
import { isUser } from "./middlewares/isUser";
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", auth, isAdmin, jewelleryRoutes);
app.use("/api/admin", auth, isAdmin, goldPriceRoutes);
app.use("/api/plan", auth,isUser, planRoutes)
app.use("/api/gift", giftRoute)


export default app;
