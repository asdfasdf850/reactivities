using API.Middleware;
using Application.Activities;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Persistence;

namespace API
{
   public class Startup
   {
      public Startup(IConfiguration configuration)
      {
         Configuration = configuration;
      }

      public IConfiguration Configuration { get; }

      public void ConfigureServices(IServiceCollection services)
      {
         services.AddDbContext<DataContext>(opt =>
         {
            opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
         });
         services.AddCors(opt =>
         {
            opt.AddPolicy("CorsPolicy", policy =>
            {
               policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
            });
         });
         services.AddMediatR(typeof(List.Handler).Assembly);
         services.AddControllers().AddFluentValidation(cfg =>
         {
            cfg.RegisterValidatorsFromAssemblyContaining<Create>();
         });
      }


      public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
      {
         app.UseMiddleware<ErrorHandlingMiddleware>();
         if (env.IsDevelopment())
         {
            // app.UseDeveloperExceptionPage();
         }
         //  app.UseHttpsRedirection();
         app.UseCors("CorsPolicy");
         app.UseRouting();
         app.UseAuthorization();
         app.UseEndpoints(endpoints =>
         {
            endpoints.MapControllers();
         });
      }
   }
}
