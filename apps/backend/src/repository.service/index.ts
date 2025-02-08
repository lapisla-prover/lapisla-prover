import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import {
  getUser,
  getUsers,
  getAllUsers,
  getUserWithFiles,
  getUserWithPublicFiles,
  getUserWithFilesAndSnapshots,
  getUserWithPublicFilesAndSnapshots,
  createUser,
  deleteUser,
} from './user.impl';

import {
  getFile,
  getFileWithSnapshots,
  getFileWithPublicSnapshots,
  getPublicFile,
  getPublicFileWithPublicSnapshots,
  createFile,
  deleteFile,
} from './file.impl';

import {
  getSnapshot,
  getSnapshotWithContent,
  getPublicSnapshot,
  getPublicSnapshotWithContent,
  createSnapshot,
  publishSnapshot,
} from './snapshot.impl';

import {
  setDependencies,
  getDependencies,
  getPublicSnapshotsWithContent,
} from './dependency.impl';

import { updateTagsAndDescription, getTags } from './tagAndDesc.impl';

import { createState } from './auth.impl';

@Injectable()
export class RepositoryService implements OnModuleInit, OnModuleDestroy {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  __doNotUseThisMethodGetPrismaClient() {
    return this.prisma;
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  // #region User methods
  async getUser(userName: string) {
    return getUser(this.prisma, userName);
  }

  async getUsers(userNames: string[]) {
    return getUsers(this.prisma, userNames);
  }

  async getAllUsers() {
    return getAllUsers(this.prisma);
  }

  async getUserWithFiles(userName: string) {
    return getUserWithFiles(this.prisma, userName);
  }

  async getUserWithPublicFiles(userName: string) {
    return getUserWithPublicFiles(this.prisma, userName);
  }

  async getUserWithFilesAndSnapshots(userName: string) {
    return getUserWithFilesAndSnapshots(this.prisma, userName);
  }

  async getUserWithPublicFilesAndSnapshots(userName: string) {
    return getUserWithPublicFilesAndSnapshots(this.prisma, userName);
  }

  async createUser(userName: string, githubId: number) {
    return createUser(this.prisma, userName, githubId);
  }

  async deleteUser(userName: string) {
    return deleteUser(this.prisma, userName);
  }
  // #endregion

  // #region File methods
  async getFile(ownerName: string, fileName: string) {
    return getFile(this.prisma, ownerName, fileName);
  }

  async getFileWithSnapshots(ownerName: string, fileName: string) {
    return getFileWithSnapshots(this.prisma, ownerName, fileName);
  }

  async getFileWithPublicSnapshots(ownerName: string, fileName: string) {
    return getFileWithPublicSnapshots(this.prisma, ownerName, fileName);
  }

  async getPublicFile(ownerName: string, fileName: string) {
    return getPublicFile(this.prisma, ownerName, fileName);
  }

  async getPublicFileWithPublicSnapshots(ownerName: string, fileName: string) {
    return getPublicFileWithPublicSnapshots(this.prisma, ownerName, fileName);
  }

  async createFile(ownerName: string, fileName: string) {
    return createFile(this.prisma, ownerName, fileName);
  }

  async deleteFile(ownerName: string, fileName: string) {
    return deleteFile(this.prisma, ownerName, fileName);
  }
  // #endregion

  // #region Snapshot methods
  async getSnapshot(ownerName: string, fileName: string, version: number) {
    return getSnapshot(this.prisma, ownerName, fileName, version);
  }

  async getSnapshotWithContent(
    ownerName: string,
    fileName: string,
    version: number,
  ) {
    return getSnapshotWithContent(this.prisma, ownerName, fileName, version);
  }

  async getPublicSnapshot(
    ownerName: string,
    fileName: string,
    version: number,
  ) {
    return getPublicSnapshot(this.prisma, ownerName, fileName, version);
  }

  async getPublicSnapshotWithContent(
    ownerName: string,
    fileName: string,
    version: number,
  ) {
    return getPublicSnapshotWithContent(
      this.prisma,
      ownerName,
      fileName,
      version,
    );
  }

  async createSnapshot(ownerName: string, fileName: string, content: string) {
    return createSnapshot(this.prisma, ownerName, fileName, content);
  }

  async publishSnapshot(ownerName: string, fileName: string, version: number) {
    return publishSnapshot(this.prisma, ownerName, fileName, version);
  }
  // #endregion

  // #region Dependency methods
  async setDependencies(
    ownerName: string,
    fileName: string,
    version: number,
    dependTo: { ownerName: string; fileName: string; version: number }[],
  ) {
    return setDependencies(this.prisma, ownerName, fileName, version, dependTo);
  }

  async getDependencies(ownerName: string, fileName: string, version: number) {
    return getDependencies(this.prisma, ownerName, fileName, version);
  }

  async getPublicSnapshotsWithContent(
    snapshots: { ownerName: string; fileName: string; version: number }[],
  ) {
    return getPublicSnapshotsWithContent(this.prisma, snapshots);
  }
  // #endregion

  // #region Tag and Description methods
  async updateTagsAndDescription(
    ownerName: string,
    fileName: string,
    version: number,
    tags: string[],
    description: string,
  ) {
    return updateTagsAndDescription(
      this.prisma,
      ownerName,
      fileName,
      version,
      tags,
      description,
    );
  }

  async getTags() {
    return getTags(this.prisma);
  }
  // #endregion

  // #region Auth methods
  async createState(state) {
    return createState(this.prisma, state);
  }
  // #endregion
}
