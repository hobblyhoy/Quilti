﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Quilti.DAL;

namespace Quilti.Migrations
{
    [DbContext(typeof(QuiltiContext))]
    [Migration("20210207033147_patch_21084")]
    partial class patch_21084
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseIdentityColumns()
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.2");

            modelBuilder.Entity("Quilti.Models.Creator", b =>
                {
                    b.Property<string>("CreatorIp")
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTimeOffset?>("CreatedDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<bool>("IsBanned")
                        .HasColumnType("bit");

                    b.Property<bool>("IsUnrestricted")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LastModifiedDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("ObjectStatus")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("CreatorIp");

                    b.ToTable("CreatorInfo");
                });

            modelBuilder.Entity("Quilti.Models.Patch", b =>
                {
                    b.Property<string>("PatchId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTimeOffset?>("CreatedDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("CreatorIp")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ImageMini")
                        .HasColumnType("VARCHAR(MAX)");

                    b.Property<DateTimeOffset?>("LastModifiedDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("ObjectStatus")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("X")
                        .HasColumnType("int");

                    b.Property<int>("Y")
                        .HasColumnType("int");

                    b.HasKey("PatchId");

                    b.ToTable("Patches");
                });

            modelBuilder.Entity("Quilti.Models.PatchImage", b =>
                {
                    b.Property<int>("PatchImageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<DateTimeOffset?>("CreatedDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("VARCHAR(MAX)");

                    b.Property<DateTimeOffset?>("LastModifiedDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("ObjectStatus")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PatchId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("PatchImageId");

                    b.HasIndex("PatchId")
                        .IsUnique()
                        .HasFilter("[PatchId] IS NOT NULL");

                    b.ToTable("PatchImages");
                });

            modelBuilder.Entity("Quilti.Models.PatchImage", b =>
                {
                    b.HasOne("Quilti.Models.Patch", "Patch")
                        .WithOne("PatchImage")
                        .HasForeignKey("Quilti.Models.PatchImage", "PatchId");

                    b.Navigation("Patch");
                });

            modelBuilder.Entity("Quilti.Models.Patch", b =>
                {
                    b.Navigation("PatchImage");
                });
#pragma warning restore 612, 618
        }
    }
}
