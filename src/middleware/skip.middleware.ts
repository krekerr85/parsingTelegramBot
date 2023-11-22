export const skipMiddleware = async (ctx, next) => {
	next().catch(err => console.log(err));
};
