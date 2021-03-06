using System.Text;
using Application.Activities;
using Application.Interfaces;
using API.Middleware;
using AutoMapper;
using Domain;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API {
   public class Startup {
      public Startup(IConfiguration configuration) {
         Configuration = configuration;
      }

      public IConfiguration Configuration { get; }

      public void ConfigureServices(IServiceCollection services) {
         services.AddDbContext<DataContext>(opt => {
            opt.UseLazyLoadingProxies();
            opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
         });

         services.AddCors(opt => {
            opt.AddPolicy("CorsPolicy", policy => {
               policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
            });
         });

         services.AddMediatR(typeof(List.Handler).Assembly);
         services.AddAutoMapper(typeof(List.Handler));

         services.AddControllers(opt => {
               var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
               opt.Filters.Add(new AuthorizeFilter(policy));
            })
            .AddFluentValidation(cfg => {
               cfg.RegisterValidatorsFromAssemblyContaining<Create>();
            });

         var builder = services.AddIdentityCore<AppUser>();
         var identityBuiler = new IdentityBuilder(builder.UserType, builder.Services);
         identityBuiler.AddEntityFrameworkStores<DataContext>();
         identityBuiler.AddSignInManager<SignInManager<AppUser>>();

         services.AddAuthorization(opt => {
            opt.AddPolicy("IsActivityHost", policy => {
               policy.Requirements.Add(new IsHostRequirement());
            });
         });

         services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();

         var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));

         services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opts => {
               opts.TokenValidationParameters = new TokenValidationParameters {
               ValidateIssuerSigningKey = true,
               IssuerSigningKey = key,
               ValidateAudience = false,
               ValidateIssuer = false
               };
            });

         services.AddScoped<IJwtGenerator, JwtGenerator>();
         services.AddScoped<IUserAccessor, UserAccessor>();
         services.AddScoped<IPhotoAccessor, PhotoAccessor>();
         services.Configure<CloudinarySettings>(Configuration.GetSection("Cloudinary"));
      }

      public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
         app.UseMiddleware<ErrorHandlingMiddleware>();
         if (env.IsDevelopment()) {
            // app.UseDeveloperExceptionPage();
         }
         //  app.UseHttpsRedirection();
         app.UseRouting();
         app.UseCors("CorsPolicy");
         app.UseAuthentication();
         app.UseAuthorization();
         app.UseEndpoints(endpoints => {
            endpoints.MapControllers();
         });
      }
   }
}